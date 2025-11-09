# SeniorBid - Claude Code Build Guidelines

## PROJECT IDENTITY
- **Name**: SeniorBid
- **Purpose**: Dead-simple auction platform for seniors (65-85) bidding on Amazon closeout items
- **Golden Rule**: If a 78-year-old with arthritis can't use it without help, it's too complicated
- **Business Model**: Store pays $99/month, seniors bid free, no buyer's premium

## CRITICAL CONSTRAINTS (NON-NEGOTIABLE)

### Accessibility Requirements
- Font size: 18px minimum, 20px preferred, 24px for critical info
- Line height: 1.6 minimum
- Button size: 60px tall minimum
- Touch targets: 44x44px minimum
- Colors: High contrast only (WCAG AAA - black on white, dark blue #1e40af on white)
- Error messages: Red, bold, 20px, plain English
- Forms: One field per screen when possible
- Navigation: No hamburger menus, everything visible

### Tech Stack
- Frontend: React 18 + Tailwind CSS 3
- Backend: Node.js 20 + Express 4
- Database: PostgreSQL 15
- Real-time: Socket.io
- SMS: Twilio
- Images: Cloudinary (free tier)
- Hosting: Railway
- Auth: Phone number + SMS verification (NO passwords)

## MUST HAVE FEATURES ONLY

1. Phone authentication (SMS code)
2. Browse all items (single page, no pagination)
3. Item detail with big photos
4. Bid button (fixed $5 increments)
5. SMS notifications (outbid, ending soon, won)
6. Real-time bid updates via WebSocket
7. Admin panel (store owner adds items)
8. Help & support (phone number visible)

## NEVER BUILD
❌ Proxy bidding / auto-bid
❌ Multiple auction formats
❌ Shipping (local pickup only)
❌ Reserve prices
❌ User profiles/settings
❌ Search/categories (browse all)
❌ Dark mode
❌ Email notifications

## KEY LESSONS FROM USER TESTING

### From Aunt Betty (76 years old)
- Need onboarding banner ("Here's how it works")
- Confirmation dialog before bid ("Are you sure?")
- SMS must include direct link to item
- Error messages must include phone number to call
- Loading states must be OBVIOUS (not subtle)

### From Store Owner Jim (68 years old)
- Image uploads must be fast (compress client-side)
- Admin needs "undo" (soft delete)
- Dashboard shows "ending soon" first
- Keep SMS costs low (batch notifications)

## BIDDING LOGIC (CRITICAL)

### Race Condition Prevention
```sql
-- Use row-level locking
SELECT * FROM items WHERE id = $1 FOR UPDATE
```

### Popcorn Bidding
- If bid in last 2 minutes → extend 2 minutes
- Max 3 extensions (6 extra minutes total)
- Prevents sniping

### Validation
- Next bid = current_bid + $500 (cents)
- Check auction hasn't ended
- Check user isn't already winning
- All in database transaction

## TAILWIND CONVENTIONS

**Buttons (Primary)**:
```jsx
className="w-full py-4 px-8 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
```

**Error Messages**:
```jsx
className="bg-red-50 border-2 border-red-600 rounded-lg p-4 text-red-600 text-lg font-semibold"
```

**Cards**:
```jsx
className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
```

## BUILD ORDER (Follow This Sequence)

### Phase 1: Backend Foundation
1. Database schema + migrations
2. Express server setup
3. Phone auth endpoints
4. JWT middleware

### Phase 2: Item Management
1. Items API (GET /items, GET /items/:id)
2. Admin auth endpoints
3. Admin items CRUD
4. Cloudinary integration

### Phase 3: Bidding Logic
1. Bid placement endpoint (with transaction)
2. WebSocket setup
3. Real-time broadcasts

### Phase 4: Frontend Core
1. React app + routing
2. Login page
3. Home page (item grid)
4. ItemCard component

### Phase 5: Item Detail & Bidding
1. Item detail page
2. Photo carousel
3. BidButton component
4. Countdown timer
5. WebSocket integration

### Phase 6: SMS Notifications
1. Twilio integration
2. SMS sending logic
3. Cron job for batching

### Phase 7: Admin Panel
1. Admin dashboard
2. Add/edit item forms
3. Photo upload UI

### Phase 8: Polish & Deploy
1. Error handling everywhere
2. Loading states
3. Empty states
4. Help button
5. Privacy policy / TOS
6. Deploy to Railway

## SUCCESS CRITERIA

A senior user can:
- Register in < 2 minutes without help
- Find and bid on item in < 1 minute
- Understand if they're winning
- Know what to do if outbid
- Complete flow without calling support

## COST TARGETS

- SMS: ~$1.60/day for 50 users (200 SMS/day @ $0.008 each)
- Cloudinary: Free tier (25GB = ~3,000 photos)
- Railway: Start with free tier
- Total infrastructure: < $50/month
