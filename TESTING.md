# SeniorBid Testing Guide

## Pre-Launch Checklist

### Phone Authentication
- [ ] Can send SMS verification code
- [ ] Code arrives within 10 seconds
- [ ] Code expires after 10 minutes
- [ ] Invalid code shows clear error
- [ ] New user can create account with name
- [ ] Existing user can log in without name
- [ ] JWT token persists for 7 days
- [ ] Logout clears token properly

### Item Browsing
- [ ] All active items display on homepage
- [ ] Items show correct current bid
- [ ] Countdown timers update every second
- [ ] Countdown shows "Ended" when auction closes
- [ ] Condition badges show correct colors
- [ ] Images load quickly (< 2 seconds)
- [ ] Grid responsive (1 col mobile, 2 tablet, 3 desktop)
- [ ] Empty state shows when no items

### Item Detail Page
- [ ] Large photos display correctly
- [ ] Photo carousel works (swipe on mobile, arrows on desktop)
- [ ] Current bid displays prominently (30px, green)
- [ ] Countdown timer visible and accurate
- [ ] Condition badge shows with emoji
- [ ] Description readable (20px font)
- [ ] Pickup info clearly visible

### Bidding Flow
- [ ] "Bid $XX" button shows next bid amount correctly (+$5)
- [ ] Button disabled if not logged in
- [ ] Button disabled if auction ended
- [ ] Confirmation modal appears before bid
- [ ] Bid processes within 500ms
- [ ] Success message shows ("You're winning!")
- [ ] Error message shows if bid fails
- [ ] Can't bid if already highest bidder
- [ ] Can't bid after auction ends

### Real-Time Updates
- [ ] WebSocket connects on page load
- [ ] Bid updates appear within 1 second
- [ ] Multiple users see same bid simultaneously
- [ ] Disconnection shows "Reconnecting..." banner
- [ ] Auto-reconnects after network interruption

### Popcorn Bidding
- [ ] Auction extends 2 min if bid in last 2 min
- [ ] Extension count increments (max 3)
- [ ] After 3 extensions, auction ends normally
- [ ] Users see updated end time

### SMS Notifications
- [ ] Outbid notification sends (batched every 2 min)
- [ ] Notification includes item name and current bid
- [ ] Notification includes link to item
- [ ] Ending soon notification sends (10 min before end)
- [ ] Won notification sends after auction ends
- [ ] No duplicate notifications within 10 min
- [ ] SMS character count < 160 (single message)

### Admin Panel
- [ ] Admin can log in with email/password
- [ ] Dashboard shows all items (active, ended, deleted)
- [ ] Can add new item with all fields
- [ ] Can upload 1-5 photos
- [ ] Photos compress to max 800px width
- [ ] Can delete item (soft delete)
- [ ] Can view item bid history
- [ ] Logout works correctly

### Admin Add Item Form
- [ ] Title required (max 200 chars)
- [ ] Description optional (max 500 chars)
- [ ] Condition dropdown works
- [ ] Starting bid validation ($1-$100)
- [ ] End time must be future
- [ ] Photo upload shows progress
- [ ] Photo preview displays
- [ ] Can remove uploaded photo
- [ ] Form validation shows errors clearly

### Accessibility
- [ ] Font size 18px minimum everywhere
- [ ] Line height 1.6 minimum
- [ ] Button height 60px minimum
- [ ] Touch targets 44×44px minimum
- [ ] Color contrast WCAG AAA compliant
- [ ] Tab navigation works (keyboard only)
- [ ] Focus states obvious (thick border)
- [ ] ARIA labels on images and buttons
- [ ] Screen reader announces page changes

### Mobile Responsiveness
- [ ] Works on iPhone 7 (or older)
- [ ] Works on Samsung Galaxy S7 (or older)
- [ ] Buttons tappable with shaky hands
- [ ] Text readable without glasses
- [ ] Swipe gestures work in carousel
- [ ] Pinch to zoom works on images
- [ ] No horizontal scrolling
- [ ] Footer visible at bottom

### Performance
- [ ] Page load < 2 seconds on 3G
- [ ] Bid placement < 500ms
- [ ] WebSocket latency < 1 second
- [ ] Images lazy load on scroll
- [ ] No layout shift when loading

### Error Handling
- [ ] Network error shows user-friendly message
- [ ] Database error doesn't crash app
- [ ] SMS failure doesn't break bidding
- [ ] WebSocket failure falls back gracefully
- [ ] All errors include phone number to call

### Edge Cases
- [ ] Two users bid at exact same time (one wins, one gets error)
- [ ] User bids after auction just ended (shows error)
- [ ] User loses internet mid-bid (reconnects and retries)
- [ ] SMS code expires (shows clear message)
- [ ] Photo upload fails (shows retry option)

## Senior User Testing Protocol

### Setup
1. Find 3-5 seniors (65-85 years old)
2. Use their own phones (not your phone)
3. Have them sit in normal lighting
4. **Do NOT help them unless they ask**
5. Record screen (with permission)

### Test Script
Give these instructions (written large on paper):

```
TASK: Bid on the Toaster

1. Open this website: [URL]
2. Create an account
3. Find the toaster
4. Place a bid
5. Tell me when you're done
```

### Observe For
- How long does each step take?
- Where do they hesitate?
- Do they tap the wrong thing?
- Can they read the text?
- Do they understand what happened?
- Do they know what to do next?

### Common Pain Points to Watch

**Login Issues:**
- "I don't see where to log in"
- "What's a verification code?"
- "I didn't get a text message"
- "I don't know my password" (there is none!)

**Browsing Issues:**
- "Which item is the toaster?"
- "How much does it cost?"
- "When does it end?"
- "How do I see more details?"

**Bidding Issues:**
- "I'm afraid to click the button"
- "Did it work?"
- "How much am I paying?"
- "Can I cancel?"
- "What if someone bids more?"

**Post-Bid Issues:**
- "Am I winning?"
- "What happens next?"
- "How do I get the item?"
- "Do I pay now?"

### Success Criteria

**Must achieve:**
- ✅ 80% can create account in < 3 minutes
- ✅ 80% can find item in < 1 minute
- ✅ 80% can place bid in < 1 minute
- ✅ 90% understand if they're winning
- ✅ 0% call for tech support during test

**Nice to have:**
- ✅ 50% say "This is easy!"
- ✅ 70% would use it again
- ✅ 0% say "This is too complicated"

### After Testing

**For each issue found:**
1. Write it down immediately
2. Rate severity (Critical / High / Medium / Low)
3. Propose a fix
4. Test fix with same user if possible

**Example:**
```
Issue: User didn't know verification code was in text message
Severity: High
Fix: Add text "Check your text messages for the code"
Result: User found code immediately on retry
```

## Automated Testing (Future)

### Unit Tests
```bash
npm test
```

Test coverage should include:
- Auth endpoints (send code, verify code)
- Bid placement logic
- SMS notification logic
- WebSocket broadcasts

### Integration Tests
```bash
npm run test:integration
```

Test full user flows:
- Register → Browse → Bid → Win
- Admin login → Add item → View bids

### Load Testing
```bash
npm run test:load
```

Simulate:
- 50 concurrent users
- 10 simultaneous bids on same item
- WebSocket reconnections

## Production Monitoring

### What to Track

**Error rates:**
- Failed logins (> 5% = investigate)
- Failed bids (> 1% = critical)
- Failed SMS (> 2% = check Twilio)

**Performance:**
- Page load time (> 3s = optimize)
- Bid latency (> 1s = investigate)
- WebSocket disconnects (> 5% = check server)

**User behavior:**
- Registration rate (< 40% = improve onboarding)
- Bid rate (< 60% = simplify bidding)
- Return rate (< 30% = improve experience)

### Railway Logs

```bash
# View live logs
railway logs

# Filter for errors
railway logs --filter error

# View last 100 lines
railway logs --tail 100
```

**Look for:**
- `❌` Database errors
- `📱` SMS failures
- `🔌` WebSocket issues
- `💰` Bid errors

## Bug Reporting Template

When reporting bugs, include:

```
**What happened:**
[Describe the issue]

**What should have happened:**
[Expected behavior]

**Steps to reproduce:**
1. Go to...
2. Click on...
3. See error...

**Screenshots:**
[Attach if possible]

**Device:**
- Phone: [iPhone 7, Samsung S7, etc.]
- Browser: [Safari, Chrome, etc.]
- OS: [iOS 12, Android 8, etc.]

**User impact:**
- Blocking: [ ] Yes [ ] No
- Frequency: [Always / Sometimes / Rare]
- Workaround: [Yes / No - describe if yes]
```

## Final Pre-Launch Check

**One week before launch:**
- [ ] All critical bugs fixed
- [ ] Tested with 5+ real seniors
- [ ] SMS balance funded ($50 minimum)
- [ ] Cloudinary storage < 50% used
- [ ] Database backups enabled on Railway
- [ ] Admin account created and tested
- [ ] Privacy policy and terms published
- [ ] Help phone number staffed
- [ ] Store owner trained on admin panel

**Launch day:**
- [ ] Monitor logs every hour
- [ ] Have phone ready for support calls
- [ ] Test one complete bid flow
- [ ] Verify SMS sending
- [ ] Check database connections
- [ ] Post in community group

**Week after launch:**
- [ ] Review error logs daily
- [ ] Call 5 users for feedback
- [ ] Track success metrics
- [ ] Fix any urgent issues
- [ ] Thank early adopters!

---

**Remember:** Every bug you find in testing is one less confused senior at launch!
