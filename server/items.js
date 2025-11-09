// Items API - Browse auction items
const express = require('express');
const pool = require('./db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// GET /api/items
// List all active items (not deleted, not ended)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        i.*,
        (SELECT COUNT(*) FROM bids WHERE item_id = i.id) as bid_count,
        (SELECT name FROM users WHERE id = (
          SELECT user_id FROM bids WHERE item_id = i.id
          ORDER BY created_at DESC LIMIT 1
        )) as current_winner_name
       FROM items i
       WHERE i.deleted_at IS NULL AND i.ends_at > NOW()
       ORDER BY i.ends_at ASC`,
      []
    );

    res.json({ items: result.rows });

  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Could not load items. Please refresh the page.' });
  }
});

// GET /api/items/:id
// Get single item details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT i.*,
        (SELECT COUNT(*) FROM bids WHERE item_id = i.id) as bid_count
       FROM items i
       WHERE i.id = $1 AND i.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = result.rows[0];

    // Get current winner
    const winnerResult = await pool.query(
      `SELECT user_id, amount FROM bids
       WHERE item_id = $1
       ORDER BY created_at DESC LIMIT 1`,
      [id]
    );

    const currentWinnerId = winnerResult.rows.length > 0
      ? winnerResult.rows[0].user_id
      : null;

    // Check if requesting user is winning (if authenticated)
    let userIsWinning = false;
    if (req.user && currentWinnerId === req.user.userId) {
      userIsWinning = true;
    }

    res.json({
      item,
      userIsWinning,
      currentWinnerId
    });

  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Could not load item details. Please try again.' });
  }
});

module.exports = router;
