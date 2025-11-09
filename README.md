# SeniorBid - Dead-Simple Auction Platform for Seniors

A beautifully simple online auction platform designed specifically for seniors (65-85 years old) to bid on Amazon closeout store items in their local community.

## 🎯 Core Philosophy

**If a 78-year-old with arthritis can't use it without help, it's too complicated.**

## ✨ Features

### For Senior Bidders
- 📱 **Phone login only** - No passwords to remember (SMS verification)
- 🔤 **Large fonts** - 18px minimum, 20px preferred (readable without glasses)
- 👆 **Big buttons** - 60px tall minimum (easy to tap with shaky hands)
- 🎨 **High contrast** - Black on white, WCAG AAA compliant
- 📲 **SMS notifications** - Get text alerts when outbid
- ⏱️ **Live countdown** - Real-time auction timers
- 🚫 **No complexity** - One button bidding, fixed $5 increments

### For Store Owners
- 📦 Add items with photos (auto-compressed)
- 📊 View all auctions and bids
- 💰 Track sales (store keeps 100%)
- 📱 Flat $99/month fee (no buyer's premium)

## 🛠️ Tech Stack

- **Frontend**: React 18 + Tailwind CSS 3 + Vite
- **Backend**: Node.js 20 + Express 4
- **Database**: PostgreSQL 15
- **Real-time**: Socket.io
- **SMS**: Twilio
- **Images**: Cloudinary (free tier)
- **Hosting**: Railway

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ installed
- Twilio account (for SMS)
- Cloudinary account (for images)

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd seniorbid

# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
\`\`\`

### 2. Set Up Database

\`\`\`bash
# Create PostgreSQL database
createdb seniorbid

# Run migrations
psql seniorbid < migrations/001_initial.sql
\`\`\`

### 3. Configure Environment Variables

Copy \`.env.example\` to \`.env\` and fill in your values:

\`\`\`bash
cp .env.example .env
\`\`\`

**Required variables:**
- \`DATABASE_URL\`: PostgreSQL connection string
- \`JWT_SECRET\`: Random secret key (generate with \`openssl rand -base64 32\`)
- \`TWILIO_ACCOUNT_SID\`: From Twilio dashboard
- \`TWILIO_AUTH_TOKEN\`: From Twilio dashboard
- \`TWILIO_PHONE_NUMBER\`: Your Twilio phone number (+15551234567)
- \`CLOUDINARY_CLOUD_NAME\`: From Cloudinary dashboard
- \`CLOUDINARY_API_KEY\`: From Cloudinary dashboard
- \`CLOUDINARY_API_SECRET\`: From Cloudinary dashboard
- \`FRONTEND_URL\`: http://localhost:5173 (for development)

### 4. Create First Admin Account

\`\`\`bash
# Start the server
npm run dev

# In another terminal, create admin (only works if no admins exist)
curl -X POST http://localhost:3000/api/admin/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@example.com","password":"your-secure-password"}'
\`\`\`

### 5. Run Development Servers

\`\`\`bash
# Run both backend and frontend
npm run dev

# OR run separately:
npm run server  # Backend on http://localhost:3000
npm run client  # Frontend on http://localhost:5173
\`\`\`

Visit http://localhost:5173 to see the app!

## 📋 Usage Guide

### For Senior Users

1. **Login**
   - Enter your phone number
   - Receive SMS code
   - Enter code + your name (first time only)

2. **Browse Items**
   - See all active auctions on homepage
   - Tap any item to see details

3. **Place a Bid**
   - Tap "Bid $XX" button
   - Confirm your bid
   - Get SMS if outbid

4. **Win & Pickup**
   - Get SMS when you win
   - Pick up at store location
   - Pay on arrival

### For Store Owners (Admin)

1. **Login**
   - Go to /admin/login
   - Use your email + password

2. **Add New Item**
   - Click "Add New Item"
   - Fill in title, description, condition
   - Upload 1-5 photos (auto-compressed)
   - Set starting bid and end time

3. **Manage Items**
   - View all items on dashboard
   - See bid counts and current prices
   - Delete items if needed

## 🗃️ Database Schema

See \`migrations/001_initial.sql\` for complete schema.

**Key tables:**
- \`users\` - Bidders (phone, name)
- \`items\` - Auction items
- \`bids\` - Bid history
- \`admins\` - Store owners
- \`verification_codes\` - SMS auth codes
- \`sms_logs\` - Track sent messages

## 🔐 Security

- **Phone auth**: No passwords (SMS verification only)
- **JWT tokens**: 7-day expiration
- **Bcrypt**: Admin passwords hashed
- **SQL injection**: Parameterized queries throughout
- **Row locking**: Race condition prevention on bids

## 📱 SMS Notifications

**When sent:**
- User is outbid (batched every 2 min to save costs)
- Auction ending in 10 minutes (once)
- User wins auction (once)

**Cost estimate:**
- 50 users × 4 SMS/week = 200 SMS/month
- 200 × $0.008 = $1.60/month

## 🎨 Design Principles

### Accessibility
- ✅ Font size: 18px minimum
- ✅ Line height: 1.6 minimum
- ✅ Button height: 60px minimum
- ✅ Touch targets: 44×44px minimum
- ✅ Color contrast: WCAG AAA
- ✅ Keyboard navigation: Full support
- ✅ Screen reader: ARIA labels

### Simplicity
- ❌ No proxy bidding
- ❌ No search/filters
- ❌ No user profiles
- ❌ No shipping
- ❌ No dark mode
- ✅ One auction format
- ✅ Fixed $5 increments
- ✅ Phone auth only
- ✅ Local pickup only

## 🚢 Deployment to Railway

### 1. Create Railway Account

Go to https://railway.app and sign up.

### 2. Install Railway CLI

\`\`\`bash
npm install -g @railway/cli
railway login
\`\`\`

### 3. Create New Project

\`\`\`bash
railway init
\`\`\`

### 4. Add PostgreSQL Database

In Railway dashboard:
- Click "New" → "Database" → "PostgreSQL"
- Railway will auto-generate DATABASE_URL

### 5. Set Environment Variables

In Railway dashboard → Variables, add:
- \`NODE_ENV=production\`
- \`JWT_SECRET=<your-secret>\`
- \`TWILIO_ACCOUNT_SID=<your-sid>\`
- \`TWILIO_AUTH_TOKEN=<your-token>\`
- \`TWILIO_PHONE_NUMBER=<your-number>\`
- \`CLOUDINARY_CLOUD_NAME=<your-cloud>\`
- \`CLOUDINARY_API_KEY=<your-key>\`
- \`CLOUDINARY_API_SECRET=<your-secret>\`
- \`FRONTEND_URL=https://your-app.railway.app\`

### 6. Run Database Migrations

\`\`\`bash
# Connect to Railway database
railway run psql $DATABASE_URL < migrations/001_initial.sql
\`\`\`

### 7. Deploy

\`\`\`bash
railway up
\`\`\`

Your app will be live at \`https://your-app.railway.app\`!

### 8. Create Admin Account

\`\`\`bash
curl -X POST https://your-app.railway.app/api/admin/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@example.com","password":"your-secure-password"}'
\`\`\`

## ✅ Testing Checklist

Before launching:

- [ ] Phone auth works (send + verify code)
- [ ] SMS notifications arrive
- [ ] Can browse items
- [ ] Can place bid
- [ ] Real-time bid updates work
- [ ] Countdown timer accurate
- [ ] Admin can add items
- [ ] Photos upload successfully
- [ ] Mobile responsive (test on old phone)
- [ ] Buttons are big enough (60px tall)
- [ ] Fonts are readable (18px+)
- [ ] High contrast colors

## 🧪 Testing with Real Seniors

**Manual test script:**
1. Give senior your phone
2. Ask them to bid on an item
3. **Don't help them**
4. Note every point of confusion
5. Fix those issues

**Success criteria:**
- Senior can register in < 2 minutes
- Senior can find and bid in < 1 minute
- Senior understands if they're winning
- Senior completes flow without calling for help

## 🐛 Common Issues

### SMS not sending
- Check Twilio credentials
- Verify phone number format (+15551234567)
- Check Twilio balance

### WebSocket not connecting
- Check CORS settings
- Verify FRONTEND_URL is correct
- Check Railway logs: \`railway logs\`

### Images not uploading
- Check Cloudinary credentials
- Verify file size < 5MB
- Check image format (JPG/PNG only)

### Database errors
- Verify DATABASE_URL is correct
- Check if migrations ran successfully
- Review Railway database logs

## 📊 Success Metrics

Track these after launch:

- **Registration rate**: % of visitors who create account (goal: >40%)
- **Bid rate**: % of users who place at least 1 bid (goal: >60%)
- **Support calls**: Number of confused users (goal: <5/week)
- **Bid completion**: % of bid attempts that succeed (goal: >95%)
- **Return rate**: % of users who return and bid again (goal: >30%)

## 📁 Project Structure

\`\`\`
seniorbid/
├── server/                  # Backend (Node.js + Express)
│   ├── index.js            # Main server + WebSocket
│   ├── db.js               # PostgreSQL connection
│   ├── auth.js             # Phone auth endpoints
│   ├── items.js            # Items API
│   ├── bids.js             # Bidding logic
│   ├── admin.js            # Admin endpoints
│   └── sms.js              # Twilio notifications
├── client/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Helper functions
│   │   └── index.css       # Tailwind styles
│   └── public/             # Static assets
├── migrations/              # Database migrations
├── .env.example            # Environment template
├── package.json            # Dependencies
└── README.md               # This file
\`\`\`

## 🤝 Contributing

This is a focused project with a specific user base. Before adding features, ask:

**"Would my 78-year-old grandmother understand this?"**

If the answer is "probably," it's a NO.

## 📞 Support

Need help?
- 📧 Email: support@seniorbid.com
- 📱 Call: (555) 123-4567

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with accessibility and simplicity in mind, inspired by seniors who deserve technology that works for them, not against them.

---

**Remember**: Simplicity is the ultimate sophistication. But also, make the buttons BIG. 👴👵
