// Bidding Logic - CRITICAL: Race condition prevention
const express = require('express');
const pool = require('./db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// POST /api/items/:id/bid
// Place a bid on an item
router.post('/:id/bid', authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const { id: itemId } = req.params;
    const { amount } = req.body; // in cents
    const userId = req.user.userId;

    // Start transaction
    await client.query('BEGIN');

    // CRITICAL: Lock the item row to prevent race conditions
    const itemResult = await client.query(
      `SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL FOR UPDATE`,
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'This item is no longer available' });
    }

    const item = itemResult.rows[0];

    // Validation 1: Check if auction has ended
    if (new Date(item.ends_at) < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This auction just closed' });
    }

    // Validation 2: Check if bid amount is correct (current_bid + $5)
    const requiredBid = item.current_bid + 500; // $5 increment
    if (amount !== requiredBid) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: `Next bid must be $${(requiredBid / 100).toFixed(2)}. Someone may have just bid!`,
        requiredBid
      });
    }

    // Validation 3: Check if user is already the highest bidder
    const currentWinnerResult = await client.query(
      `SELECT user_id FROM bids WHERE item_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [itemId]
    );

    if (currentWinnerResult.rows.length > 0 &&
        currentWinnerResult.rows[0].user_id === userId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "You're already the highest bidder!" });
    }

    // Popcorn bidding: Extend auction if bid placed in last 2 minutes
    const timeLeft = new Date(item.ends_at) - new Date();
    const twoMinutes = 2 * 60 * 1000;

    let auctionExtended = false;
    if (timeLeft < twoMinutes && item.extension_count < 3) {
      const newEndsAt = new Date(new Date(item.ends_at).getTime() + twoMinutes);
      await client.query(
        `UPDATE items
         SET ends_at = $1, extension_count = extension_count + 1
         WHERE id = $2`,
        [newEndsAt, itemId]
      );
      auctionExtended = true;
      console.log(`⏱️  Auction ${itemId} extended by 2 minutes (extension ${item.extension_count + 1}/3)`);
    }

    // Insert the bid
    await client.query(
      `INSERT INTO bids (item_id, user_id, amount) VALUES ($1, $2, $3)`,
      [itemId, userId, amount]
    );

    // Update item's current bid
    await client.query(
      `UPDATE items SET current_bid = $1 WHERE id = $2`,
      [amount, itemId]
    );

    // Commit transaction
    await client.query('COMMIT');

    // Get user info for WebSocket broadcast
    const userResult = await pool.query(
      `SELECT name FROM users WHERE id = $1`,
      [userId]
    );

    console.log(`💰 Bid placed: $${(amount / 100).toFixed(2)} on item ${itemId} by ${userResult.rows[0].name}`);

    res.json({
      success: true,
      newBid: amount,
      auctionExtended,
      message: "You're winning!"
    });

    // Note: WebSocket broadcast will be handled in index.js after this endpoint returns

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

module.exports = router;
