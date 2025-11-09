// Admin Panel - Store owner endpoints
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Middleware: Verify admin JWT token
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Please log in as admin' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded.adminId) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  });
}

// POST /api/admin/login
// Admin login with email + password (bcrypt)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find admin
    const result = await pool.query(
      `SELECT * FROM admins WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const admin = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`👨‍💼 Admin logged in: ${admin.email}`);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ error: 'Could not log in. Please try again.' });
  }
});

// POST /api/admin/register (for first-time setup)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if any admins exist (only allow if this is first admin)
    const existingAdmins = await pool.query(`SELECT COUNT(*) FROM admins`);
    if (parseInt(existingAdmins.rows[0].count) > 0) {
      return res.status(403).json({ error: 'Admin registration disabled' });
    }

    if (!email || !password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin
    const result = await pool.query(
      `INSERT INTO admins (email, password_hash) VALUES ($1, $2) RETURNING *`,
      [email.toLowerCase(), passwordHash]
    );

    console.log(`👨‍💼 First admin created: ${email}`);

    res.json({ success: true, message: 'Admin account created' });

  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Could not create admin account' });
  }
});

// GET /api/admin/items
// List ALL items (including ended and deleted) for admin dashboard
router.get('/items', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*,
        (SELECT COUNT(*) FROM bids WHERE item_id = i.id) as bid_count,
        (SELECT MAX(amount) FROM bids WHERE item_id = i.id) as highest_bid
       FROM items i
       ORDER BY
         CASE WHEN i.deleted_at IS NULL AND i.ends_at > NOW() THEN 0 ELSE 1 END,
         i.ends_at ASC`
    );

    res.json({ items: result.rows });

  } catch (error) {
    console.error('Error fetching admin items:', error);
    res.status(500).json({ error: 'Could not load items' });
  }
});

// POST /api/admin/items
// Create new auction item
router.post('/items', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, condition, starting_bid, ends_at, image_urls } = req.body;

    // Validation
    if (!title || !condition || !ends_at) {
      return res.status(400).json({ error: 'Title, condition, and end time are required' });
    }

    if (!['Works Great', 'Minor Damage', 'As-Is'].includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition value' });
    }

    const startingBidCents = starting_bid ? parseInt(starting_bid) * 100 : 100;
    if (startingBidCents < 100 || startingBidCents > 10000) {
      return res.status(400).json({ error: 'Starting bid must be between $1 and $100' });
    }

    // Insert item
    const result = await pool.query(
      `INSERT INTO items (title, description, condition, starting_bid, current_bid, ends_at, image_urls)
       VALUES ($1, $2, $3, $4, $4, $5, $6)
       RETURNING *`,
      [title, description || '', condition, startingBidCents, ends_at, image_urls || []]
    );

    console.log(`📦 New item created: ${title}`);

    res.json({ success: true, item: result.rows[0] });

  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Could not create item. Please try again.' });
  }
});

// PUT /api/admin/items/:id
// Update auction item
router.put('/items/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, condition, ends_at, image_urls } = req.body;

    // Check if item has bids (if so, only allow limited updates)
    const bidCheck = await pool.query(
      `SELECT COUNT(*) FROM bids WHERE item_id = $1`,
      [id]
    );

    const hasBids = parseInt(bidCheck.rows[0].count) > 0;

    if (hasBids) {
      // Only allow updating description, images, and end time
      await pool.query(
        `UPDATE items
         SET description = $1, image_urls = $2, ends_at = $3
         WHERE id = $4`,
        [description, image_urls, ends_at, id]
      );
    } else {
      // Allow full update if no bids
      await pool.query(
        `UPDATE items
         SET title = $1, description = $2, condition = $3, ends_at = $4, image_urls = $5
         WHERE id = $6`,
        [title, description, condition, ends_at, image_urls, id]
      );
    }

    console.log(`📝 Item updated: ${id}`);

    res.json({ success: true, message: 'Item updated' });

  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Could not update item' });
  }
});

// DELETE /api/admin/items/:id
// Soft delete item
router.delete('/items/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete (set deleted_at)
    await pool.query(
      `UPDATE items SET deleted_at = NOW() WHERE id = $1`,
      [id]
    );

    console.log(`🗑️  Item soft-deleted: ${id}`);

    res.json({ success: true, message: 'Item deleted' });

  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Could not delete item' });
  }
});

// POST /api/admin/upload
// Upload photo to Cloudinary
router.post('/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'seniorbid',
          transformation: [
            { width: 800, crop: 'limit' }, // Max 800px width
            { quality: 'auto' } // Auto quality optimization
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    console.log(`📸 Photo uploaded to Cloudinary: ${result.secure_url}`);

    res.json({
      success: true,
      url: result.secure_url
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Could not upload image. Please try again.' });
  }
});

module.exports = router;
