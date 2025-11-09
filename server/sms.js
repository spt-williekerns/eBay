// SMS Notification System - Twilio integration with batching
const twilio = require('twilio');
const pool = require('./db');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Send "outbid" notification to previous highest bidder
async function sendOutbidNotification(itemId, previousWinnerId, newBid) {
  try {
    // Get user and item info
    const userResult = await pool.query(
      `SELECT phone, name FROM users WHERE id = $1`,
      [previousWinnerId]
    );

    const itemResult = await pool.query(
      `SELECT title FROM items WHERE id = $1`,
      [itemId]
    );

    if (userResult.rows.length === 0 || itemResult.rows.length === 0) {
      return;
    }

    const user = userResult.rows[0];
    const item = itemResult.rows[0];

    // Check if we already sent this notification recently (prevent spam)
    const recentLog = await pool.query(
      `SELECT * FROM sms_logs
       WHERE user_id = $1 AND item_id = $2 AND message_type = 'outbid'
         AND sent_at > NOW() - INTERVAL '5 minutes'`,
      [previousWinnerId, itemId]
    );

    if (recentLog.rows.length > 0) {
      console.log(`📱 Skipping duplicate outbid SMS to ${user.phone}`);
      return;
    }

    // Create message (160 char limit for single SMS)
    const bidAmount = `$${(newBid / 100).toFixed(2)}`;
    const link = `${FRONTEND_URL}/items/${itemId}`;
    const message = `You were outbid on ${item.title}. Current bid: ${bidAmount}. Tap to bid: ${link}`;

    // Send SMS
    await twilioClient.messages.create({
      to: user.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: message
    });

    // Log SMS
    await pool.query(
      `INSERT INTO sms_logs (user_id, item_id, message_type, phone, message)
       VALUES ($1, $2, 'outbid', $3, $4)`,
      [previousWinnerId, itemId, user.phone, message]
    );

    console.log(`📱 Outbid SMS sent to ${user.name} (${user.phone})`);

  } catch (error) {
    console.error('Error sending outbid SMS:', error);
    // Don't throw - SMS failures shouldn't break the bidding flow
  }
}

// Send "ending soon" notifications (called by cron job)
async function sendEndingSoonNotifications() {
  try {
    // Find items ending in next 10 minutes
    const itemsResult = await pool.query(
      `SELECT * FROM items
       WHERE deleted_at IS NULL
         AND ends_at > NOW()
         AND ends_at < NOW() + INTERVAL '10 minutes'`
    );

    for (const item of itemsResult.rows) {
      // Find users who bid on this item but aren't winning
      const biddersResult = await pool.query(
        `SELECT DISTINCT u.id, u.phone, u.name
         FROM bids b
         JOIN users u ON b.user_id = u.id
         WHERE b.item_id = $1
           AND b.user_id != (
             SELECT user_id FROM bids
             WHERE item_id = $1
             ORDER BY created_at DESC LIMIT 1
           )`,
        [item.id]
      );

      for (const bidder of biddersResult.rows) {
        // Check if already sent
        const recentLog = await pool.query(
          `SELECT * FROM sms_logs
           WHERE user_id = $1 AND item_id = $2 AND message_type = 'ending_soon'
             AND sent_at > NOW() - INTERVAL '30 minutes'`,
          [bidder.id, item.id]
        );

        if (recentLog.rows.length > 0) {
          continue; // Skip if already sent
        }

        // Send SMS
        const link = `${FRONTEND_URL}/items/${item.id}`;
        const currentBid = `$${(item.current_bid / 100).toFixed(2)}`;
        const message = `Auction ending in 10 min: ${item.title}. Current bid: ${currentBid}. ${link}`;

        await twilioClient.messages.create({
          to: bidder.phone,
          from: process.env.TWILIO_PHONE_NUMBER,
          body: message
        });

        // Log SMS
        await pool.query(
          `INSERT INTO sms_logs (user_id, item_id, message_type, phone, message)
           VALUES ($1, $2, 'ending_soon', $3, $4)`,
          [bidder.id, item.id, bidder.phone, message]
        );

        console.log(`📱 Ending soon SMS sent to ${bidder.name}`);
      }
    }

  } catch (error) {
    console.error('Error sending ending soon notifications:', error);
  }
}

// Send "won" notifications (called by cron job)
async function sendWonNotifications() {
  try {
    // Find items that ended in last 5 minutes
    const itemsResult = await pool.query(
      `SELECT * FROM items
       WHERE deleted_at IS NULL
         AND ends_at < NOW()
         AND ends_at > NOW() - INTERVAL '5 minutes'`
    );

    for (const item of itemsResult.rows) {
      // Find winner
      const winnerResult = await pool.query(
        `SELECT user_id, amount FROM bids
         WHERE item_id = $1
         ORDER BY created_at DESC LIMIT 1`,
        [item.id]
      );

      if (winnerResult.rows.length === 0) {
        continue; // No bids
      }

      const winnerId = winnerResult.rows[0].user_id;
      const finalBid = winnerResult.rows[0].amount;

      // Check if already sent
      const recentLog = await pool.query(
        `SELECT * FROM sms_logs
         WHERE user_id = $1 AND item_id = $2 AND message_type = 'won'`,
        [winnerId, item.id]
      );

      if (recentLog.rows.length > 0) {
        continue; // Already sent
      }

      // Get winner info
      const userResult = await pool.query(
        `SELECT phone, name FROM users WHERE id = $1`,
        [winnerId]
      );

      if (userResult.rows.length === 0) {
        continue;
      }

      const winner = userResult.rows[0];

      // Send SMS
      const bidAmount = `$${(finalBid / 100).toFixed(2)}`;
      const message = `You won ${item.title} for ${bidAmount}! Pick up at 123 Main St. Pay on arrival.`;

      await twilioClient.messages.create({
        to: winner.phone,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: message
      });

      // Log SMS
      await pool.query(
        `INSERT INTO sms_logs (user_id, item_id, message_type, phone, message)
         VALUES ($1, $2, 'won', $3, $4)`,
        [winnerId, item.id, winner.phone, message]
      );

      // Update item winner_id
      await pool.query(
        `UPDATE items SET winner_id = $1 WHERE id = $2`,
        [winnerId, item.id]
      );

      console.log(`🎉 Won SMS sent to ${winner.name} for ${item.title}`);
    }

  } catch (error) {
    console.error('Error sending won notifications:', error);
  }
}

module.exports = {
  sendOutbidNotification,
  sendEndingSoonNotifications,
  sendWonNotifications
};
