# SeniorBid - Quick Start Guide

## 🚀 Get Running in 10 Minutes

### Prerequisites
- Node.js 20+ installed
- PostgreSQL 15+ installed
- Twilio account (free tier works!)
- Cloudinary account (free tier works!)

---

## Step 1: Install Dependencies (2 min)

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

---

## Step 2: Set Up Database (2 min)

```bash
# Create database
createdb seniorbid

# Run migrations
psql seniorbid < migrations/001_initial.sql
```

---

## Step 3: Configure Environment (3 min)

```bash
# Copy template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your favorite editor
```

**Required values:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/seniorbid
JWT_SECRET=<run: openssl rand -base64 32>

# Get from https://twilio.com/console
TWILIO_ACCOUNT_SID=ACxxxx...
TWILIO_AUTH_TOKEN=xxxx...
TWILIO_PHONE_NUMBER=+15551234567

# Get from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=xxxx...
CLOUDINARY_API_SECRET=xxxx...

FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

---

## Step 4: Create Admin Account (1 min)

```bash
# Start server (in one terminal)
npm run server

# Create admin (in another terminal)
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'
```

---

## Step 5: Run the App (2 min)

```bash
# Run both frontend and backend
npm run dev
```

**Open in browser:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Admin: http://localhost:5173/admin/login

---

## ✅ Test It Works

### Test Senior Flow
1. Go to http://localhost:5173
2. Click "Login"
3. Enter phone number (use your real number for testing)
4. Check your phone for SMS code
5. Enter code + your name
6. You should see the homepage!

### Test Admin Flow
1. Go to http://localhost:5173/admin/login
2. Login with admin email/password
3. Click "Add New Item"
4. Fill in form and upload photo
5. Submit - item should appear on homepage!

### Test Bidding
1. Login as senior user
2. Click on an item
3. Click "Bid $X" button
4. Confirm bid
5. You should see "You're winning!"

---

## 🐛 Common Issues

### "Database connection failed"
- Check PostgreSQL is running: `pg_ctl status`
- Verify DATABASE_URL in .env
- Try: `psql seniorbid` to test connection

### "Twilio error"
- Verify credentials in .env
- Check Twilio account balance
- Verify phone number format: +15551234567

### "Port already in use"
- Kill existing process: `lsof -ti:3000 | xargs kill`
- Or change PORT in .env

### "Module not found"
- Re-run: `npm install && cd client && npm install`
- Delete node_modules and reinstall

---

## 📝 Next Steps

### Add Your First Item (Admin)
1. Login to /admin
2. Click "Add New Item"
3. Upload 3-5 clear photos
4. Write simple description
5. Set end time (tomorrow at 6pm)
6. Submit!

### Test with Real Phone
1. Open site on your phone
2. Complete entire bid flow
3. Check SMS arrives
4. Test on slow 3G connection
5. Have someone 65+ test it!

### Deploy to Production
See README.md for full deployment guide to Railway.

Quick deploy:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

## 📚 Documentation

- **Full Setup**: See README.md
- **Testing**: See TESTING.md
- **Project Guidelines**: See PROJECT_GUIDELINES.md

---

## 🆘 Need Help?

**Check logs:**
```bash
# Server logs
npm run server

# Check for errors in browser console (F12)
```

**Still stuck?**
- Read the error message carefully
- Check .env file has all values filled in
- Verify all services (Postgres, Twilio, Cloudinary) are working
- Review README.md troubleshooting section

---

## 🎉 You're Ready!

If you got this far and everything works:
- ✅ Database is set up
- ✅ Server is running
- ✅ Frontend is running
- ✅ Admin account created
- ✅ SMS sending works
- ✅ Image uploads work

**Now go test with real seniors!** 👴👵

Remember: If they get confused, it's not their fault - it's your design. Keep iterating until it's dead simple.

---

**Key Philosophy:**
> "If a 78-year-old with arthritis can't use it without help, it's too complicated."

Make the buttons BIG. Make the fonts BIG. Make the errors CLEAR.

Good luck! 🚀
