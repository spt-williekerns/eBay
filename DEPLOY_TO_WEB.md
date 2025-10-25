# 🌐 Get a Web Link to Preview on Your iPhone

## What You'll Get:
A website link like: `https://marshall-auction.vercel.app`

You can open it on your iPhone Safari and it works like an app!

---

## 📋 Someone Needs to Run These Commands (One Time):

**Copy and paste these commands into Terminal:**

```bash
# Step 1: Go to the project folder
cd /path/to/eBay

# Step 2: Make sure you're on the right branch
git checkout claude/senior-auction-app-frontend-011CUMafF42VFLA5UxN3B7wT

# Step 3: Install everything needed
npm install

# Step 4: Build the website version
npm run build:web

# Step 5: Deploy to Vercel (creates the website)
npx vercel deploy --prod
```

---

## 🎯 What Happens:

1. **After Step 5**, Vercel will ask some questions:
   - "Set up and deploy?" → Press **Y** (yes)
   - "Which scope?" → Press **Enter** (use default)
   - "Link to existing project?" → Press **N** (no)
   - "What's your project's name?" → Type **marshall-auction** (or anything)
   - "In which directory is your code located?" → Press **Enter** (use ./)
   - Wait 30 seconds...

2. **You'll get a URL!** Something like:
   ```
   https://marshall-auction.vercel.app
   ```

3. **Copy that URL** and open it on your iPhone!

---

## 📱 On Your iPhone:

1. **Open Safari**
2. **Paste the URL** (like https://marshall-auction.vercel.app)
3. **Tap the Share button** (square with arrow)
4. **Tap "Add to Home Screen"**
5. **Done!** Now there's an icon on your home screen

Tap that icon and it opens like a real app! 🎉

---

## ❓ If Something Goes Wrong:

**Error: "command not found: npm"**
- Need to install Node.js first
- Download from: https://nodejs.org/
- Install it, then try again

**Error: "vercel: command not found"**
- Run this first: `npm install -g vercel`
- Then try the deploy command again

**Any other error:**
- Send me the error message and I'll help fix it!

---

## 🔄 Update the Website Later:

If you make changes and want to update the website:

```bash
npm run build:web
npx vercel deploy --prod
```

Same URL, just refreshes the content!

---

## ⏱️ How Long Does This Take?

- **First time**: 5-10 minutes (downloading packages)
- **Every time after**: 2 minutes (just building and deploying)

---

## 💡 Alternative: I Can Deploy It

If this is too technical, I can:
1. Create a cloud deployment
2. Give you a working URL
3. You just click and use!

Just let me know! 🚀
