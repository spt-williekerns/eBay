-- SeniorBid Database Schema
-- Following PROJECT_GUIDELINES.md constraints

-- Users table (seniors who bid)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);

-- Items table (auction items from store)
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  condition VARCHAR(50) NOT NULL CHECK (condition IN ('Works Great', 'Minor Damage', 'As-Is')),
  starting_bid INTEGER DEFAULT 100, -- cents (e.g., 100 = $1.00)
  current_bid INTEGER DEFAULT 100, -- cents
  image_urls TEXT[], -- array of Cloudinary URLs
  ends_at TIMESTAMPTZ NOT NULL,
  extension_count INTEGER DEFAULT 0, -- for "popcorn bidding" (max 3)
  winner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete
);

CREATE INDEX idx_items_ends_at ON items(ends_at);
CREATE INDEX idx_items_deleted_at ON items(deleted_at);

-- Bids table (track every bid for transparency)
CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- cents
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bids_item_id ON bids(item_id);
CREATE INDEX idx_bids_user_id ON bids(user_id);

-- SMS logs (for deduplication and cost tracking)
CREATE TABLE sms_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  item_id INTEGER REFERENCES items(id),
  message_type VARCHAR(50) NOT NULL, -- 'outbid', 'ending_soon', 'won'
  phone VARCHAR(15) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sms_logs_user_item ON sms_logs(user_id, item_id, message_type);

-- Admin users (store owners)
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS verification codes (for phone auth)
CREATE TABLE verification_codes (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_codes_phone ON verification_codes(phone);
CREATE INDEX idx_verification_codes_expires ON verification_codes(expires_at);
