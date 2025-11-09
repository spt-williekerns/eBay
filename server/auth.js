// Phone Authentication System
// NO PASSWORDS - SMS verification only (senior-friendly)
const express = require('express');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const pool = require('./db');

const router = express.Router();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate random 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-code
// Send SMS verification code to phone number
router.post('/send-code', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number format
    if (!phone || !phone.match(/^\+1\d{10}$/)) {
      return res.status(400).json({
        error: 'Please enter a valid US phone number (e.g., +15551234567)'
      });
    }

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store code in database
    await pool.query(
      `INSERT INTO verification_codes (phone, code, expires_at)
       VALUES ($1, $2, $3)`,
      [phone, code, expiresAt]
    );

    // Send SMS via Twilio
    await twilioClient.messages.create({
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `Your SeniorBid verification code is: ${code}\n\nThis code expires in 10 minutes.`
    });

    console.log(`📱 Sent verification code to ${phone}`);

    res.json({ success: true, message: 'Code sent! Check your text messages.' });

  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({
      error: 'Could not send code. Please try again or call (555) 123-4567 for help.'
    });
  }
});

// POST /api/auth/verify-code
// Verify code and create/login user
router.post('/verify-code', async (req, res) => {
  try {
    const { phone, code, name } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and code are required' });
    }

    // Find valid code
    const codeResult = await pool.query(
      `SELECT * FROM verification_codes
       WHERE phone = $1 AND code = $2 AND expires_at > NOW() AND used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [phone, code]
    );

    if (codeResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired code. Please request a new code.'
      });
    }

    // Mark code as used
    await pool.query(
      `UPDATE verification_codes SET used = TRUE WHERE id = $1`,
      [codeResult.rows[0].id]
    );

    // Check if user exists
    let userResult = await pool.query(
      `SELECT * FROM users WHERE phone = $1`,
      [phone]
    );

    let user;
    if (userResult.rows.length === 0) {
      // New user - create account
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          error: 'Please provide your name to create an account'
        });
      }

      const newUserResult = await pool.query(
        `INSERT INTO users (phone, name) VALUES ($1, $2) RETURNING *`,
        [phone, name.trim()]
      );
      user = newUserResult.rows[0];
      console.log(`👤 New user created: ${user.name} (${user.phone})`);
    } else {
      // Existing user
      user = userResult.rows[0];
      console.log(`👤 User logged in: ${user.name} (${user.phone})`);
    }

    // Generate JWT token (7 days expiration)
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({
      error: 'Could not verify code. Please try again or call (555) 123-4567 for help.'
    });
  }
});

// Middleware: Verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Please log in to continue' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired. Please log in again.' });
    }
    req.user = decoded; // { userId, phone }
    next();
  });
}

module.exports = { router, authenticateToken };
