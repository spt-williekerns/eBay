# Demo v1 Test Script
## 15 Critical Test Cases

### Prerequisites
```bash
cd /home/user/eBay
npm install
npm run build:web
# Upload dist/ folder to cPanel OR test locally with: npx serve dist -p 3000
```

---

## Test Case 1: First-Run Registration
**Steps:**
1. Open app in browser (clear localStorage first)
2. Registration modal should appear automatically
3. Fill in: Name="Test User", Email="test@example.com", Town="Benton, KY"
4. Click "Create My Account"

**Expected:**
- Modal closes
- Home screen appears
- Profile tab shows Bidder ID (format: KC-#####)

**Pass/Fail:** ___

---

## Test Case 2: View Existing Auctions
**Steps:**
1. On Home tab
2. Scroll through event list

**Expected:**
- See at least 2 mock events
- Events show location, date, lot count
- Can tap to view (if detail screen exists)

**Pass/Fail:** ___

---

## Test Case 3: Admin Panel Access
**Steps:**
1. Navigate to `/admin` route manually (type in browser)
2. See admin interface

**Expected:**
- Admin panel loads
- Can switch between "Create Event" and "Create Lot" tabs

**Pass/Fail:** ___

---

## Test Case 4: Create Event (Admin)
**Steps:**
1. In admin panel, "Create Event" tab
2. Enter Event Name="Test Auction"
3. Enter Location="Murray, KY"
4. Click "Create Event"

**Expected:**
- Success message appears
- Event appears in Home tab event list

**Pass/Fail:** ___

---

## Test Case 5: Create Lot (Admin)
**Steps:**
1. In admin panel, "Create Lot" tab
2. Select the event just created
3. Enter Title="Test Item", Starting Bid="10", Duration="5"
4. Click "Add Placeholder Image"
5. Click "Create Lot"

**Expected:**
- Success message appears
- Lot appears in auction (should be live with 5min countdown)

**Pass/Fail:** ___

---

## Test Case 6: Add to Watchlist
**Steps:**
1. Go to Home tab
2. Find a lot card
3. Tap star icon

**Expected:**
- Star fills in (becomes solid)
- Go to Watchlist tab → lot appears there

**Pass/Fail:** ___

---

## Test Case 7: Place Bid (Happy Path)
**Steps:**
1. Find active lot
2. Tap "BID NOW" button
3. Wait for response

**Expected:**
- Optimistic UI: bid amount increases immediately
- Toast appears: "Bid placed successfully!"
- Go to Bids tab → lot appears in "Active" section
- Shows "Your bid: $X"

**Pass/Fail:** ___

---

## Test Case 8: Countdown Timer Accuracy
**Steps:**
1. Find lot with <2 minutes remaining
2. Watch countdown

**Expected:**
- Timer updates every second
- At 30s: warning sound plays (if enabled), color changes to orange
- At 10s: urgent sound plays, color changes to red, shakes
- At 0s: shows "ENDED", plays end sound

**Pass/Fail:** ___

---

## Test Case 9: Auction Closes (Winner Determination)
**Steps:**
1. Wait for a lot you bid on to reach 0:00
2. Check Bids tab after it closes

**Expected:**
- If you have highest bid → moves to "WON" tab, shows final price
- If someone else bid higher → moves to "LOST" tab, shows final price

**Pass/Fail:** ___

---

## Test Case 10: Outbid Scenario
**Steps:**
1. Open app in two browser tabs (different users via incognito)
2. Both bid on same lot
3. User A bids $50
4. User B bids $51

**Expected:**
- User A sees "Outbid!" banner
- Lot moves to "Lost" tab for User A
- Shows final price $51

**Pass/Fail:** ___

---

## Test Case 11: Refresh Persistence
**Steps:**
1. Place a bid on active lot
2. Refresh browser (F5)
3. Check Bids tab

**Expected:**
- Registration data persists (no re-reg modal)
- Active bid still appears in "Active" tab
- Countdown timer resumes correctly

**Pass/Fail:** ___

---

## Test Case 12: Mass Delete Watchlist
**Steps:**
1. Add 3+ items to watchlist
2. Go to Watchlist tab
3. Tap "Delete All" button (if exists) OR individually remove

**Expected:**
- All items removed
- Watchlist shows empty state

**Pass/Fail:** ___

---

## Test Case 13: Settings Persistence
**Steps:**
1. Go to Profile tab
2. Toggle "Sound Effects" OFF
3. Toggle "Button Vibration" OFF
4. Refresh browser

**Expected:**
- Settings persist (still OFF after refresh)
- Bid buttons don't vibrate or play sounds

**Pass/Fail:** ___

---

## Test Case 14: Error Handling (Network Failure)
**Steps:**
1. Open Chrome DevTools → Network tab → Throttle to "Offline"
2. Try to place a bid

**Expected:**
- Shows "Retrying..." message
- After 3 retries, shows "Bid failed. Check connection." error banner
- Bid doesn't appear in Active tab

**Pass/Fail:** ___

---

## Test Case 15: Mobile Responsiveness
**Steps:**
1. Open Chrome DevTools → Toggle device toolbar
2. Select iPhone 12 Pro
3. Test registration → browse → bid flow

**Expected:**
- All touch targets ≥44px (easy to tap)
- Fonts readable (≥40pt for body text)
- No horizontal scroll
- Keyboard doesn't obscure inputs

**Pass/Fail:** ___

---

## Summary
**Total Passed:** ___ / 15
**Critical Failures:** ___
**Ready for Demo:** YES / NO

---

## Known Limitations (Expected for Demo v1)
- ✓ Data persists in localStorage only (no real database)
- ✓ "Outbid" scenario is simulated (no WebSocket)
- ✓ Images are placeholders (no real upload)
- ✓ No email verification
- ✓ No payment processing
- ✓ Single-device only (no multi-user sync)
