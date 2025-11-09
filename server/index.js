// SeniorBid Main Server
// Express + Socket.io for real-time bidding
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const pool = require('./db');
const { router: authRouter } = require('./auth');
const itemsRouter = require('./items');
const bidsRouter = require('./bids');
const adminRouter = require('./admin');
const { sendOutbidNotification, sendEndingSoonNotifications, sendWonNotifications } = require('./sms');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SeniorBid server is running' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/items', bidsRouter); // Bid routes are nested under /api/items/:id/bid
app.use('/api/admin', adminRouter);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // User joins a room for specific item
  socket.on('join_item', (data) => {
    const { itemId } = data;
    socket.join(`item_${itemId}`);
    console.log(`User ${socket.id} joined room: item_${itemId}`);
  });

  // User leaves item room
  socket.on('leave_item', (data) => {
    const { itemId } = data;
    socket.leave(`item_${itemId}`);
    console.log(`User ${socket.id} left room: item_${itemId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Broadcast bid update to all clients watching this item
async function broadcastBidUpdate(itemId, newBid, userId) {
  try {
    // Get user info
    const userResult = await pool.query(
      `SELECT name FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) return;

    const userName = userResult.rows[0].name;

    // Get updated item info
    const itemResult = await pool.query(
      `SELECT ends_at FROM items WHERE id = $1`,
      [itemId]
    );

    if (itemResult.rows.length === 0) return;

    // Broadcast to all clients in this item's room
    io.to(`item_${itemId}`).emit('bid_update', {
      itemId,
      newBid,
      userName,
      endsAt: itemResult.rows[0].ends_at
    });

    console.log(`📡 Broadcast bid update for item ${itemId}: $${(newBid / 100).toFixed(2)}`);

  } catch (error) {
    console.error('Error broadcasting bid update:', error);
  }
}

// Make broadcast function available globally
global.broadcastBidUpdate = broadcastBidUpdate;

// Enhanced bid endpoint with WebSocket broadcast
app.post('/api/items/:id/bid', async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { id: itemId } = req.params;
    const { amount } = req.body;

    // Get user ID from JWT (using auth middleware)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Please log in to bid' });
    }

    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Session expired. Please log in again.' });
    }

    const userId = decoded.userId;

    // Start transaction
    await client.query('BEGIN');

    // Lock the item row
    const itemResult = await client.query(
      `SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL FOR UPDATE`,
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'This item is no longer available' });
    }

    const item = itemResult.rows[0];

    // Validation 1: Auction hasn't ended
    if (new Date(item.ends_at) < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This auction just closed' });
    }

    // Validation 2: Correct bid amount
    const requiredBid = item.current_bid + 500;
    if (amount !== requiredBid) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: `Next bid must be $${(requiredBid / 100).toFixed(2)}. Someone may have just bid!`,
        requiredBid
      });
    }

    // Validation 3: User isn't already winning
    const currentWinnerResult = await client.query(
      `SELECT user_id FROM bids WHERE item_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [itemId]
    );

    let previousWinnerId = null;
    if (currentWinnerResult.rows.length > 0) {
      previousWinnerId = currentWinnerResult.rows[0].user_id;
      if (previousWinnerId === userId) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: "You're already the highest bidder!" });
      }
    }

    // Popcorn bidding
    const timeLeft = new Date(item.ends_at) - new Date();
    const twoMinutes = 2 * 60 * 1000;
    let auctionExtended = false;

    if (timeLeft < twoMinutes && item.extension_count < 3) {
      const newEndsAt = new Date(new Date(item.ends_at).getTime() + twoMinutes);
      await client.query(
        `UPDATE items SET ends_at = $1, extension_count = extension_count + 1 WHERE id = $2`,
        [newEndsAt, itemId]
      );
      auctionExtended = true;
    }

    // Insert bid
    await client.query(
      `INSERT INTO bids (item_id, user_id, amount) VALUES ($1, $2, $3)`,
      [itemId, userId, amount]
    );

    // Update current bid
    await client.query(
      `UPDATE items SET current_bid = $1 WHERE id = $2`,
      [amount, itemId]
    );

    await client.query('COMMIT');

    // Broadcast via WebSocket
    await broadcastBidUpdate(itemId, amount, userId);

    // Send SMS to previous winner (async, don't wait)
    if (previousWinnerId) {
      sendOutbidNotification(itemId, previousWinnerId, amount).catch(err => {
        console.error('SMS notification failed:', err);
      });
    }

    res.json({
      success: true,
      newBid: amount,
      auctionExtended,
      message: "You're winning!"
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error placing bid:', error);
    res.status(500).json({
      error: 'Could not place bid. Please try again or call (555) 123-4567 for help.'
    });
  } finally {
    client.release();
  }
});

// Cron jobs for SMS notifications (run every 2 minutes)
cron.schedule('*/2 * * * *', async () => {
  console.log('⏰ Running cron: Checking for notifications to send...');
  try {
    await sendEndingSoonNotifications();
    await sendWonNotifications();
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

// Cron job to mark ended auctions (run every minute)
cron.schedule('* * * * *', async () => {
  try {
    const result = await pool.query(
      `UPDATE items
       SET winner_id = (
         SELECT user_id FROM bids
         WHERE item_id = items.id
         ORDER BY created_at DESC LIMIT 1
       )
       WHERE ends_at < NOW() AND winner_id IS NULL AND deleted_at IS NULL`
    );

    if (result.rowCount > 0) {
      console.log(`⏰ Marked ${result.rowCount} auctions as ended`);
    }
  } catch (error) {
    console.error('Error marking ended auctions:', error);
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🏠 SeniorBid Server Running         ║
║   📍 Port: ${PORT}                        ║
║   🔌 WebSocket: Enabled               ║
║   📱 SMS: ${process.env.TWILIO_PHONE_NUMBER ? 'Configured' : 'Not configured'}           ║
╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    pool.end();
  });
});
