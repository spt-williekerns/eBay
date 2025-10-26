# Bid Integrity Reproduction Scripts

## Setup

All repros assume production API exists at `/api/bids` (currently mock only, `inferred_spec.md:49`).

---

## Repro A: Outbid After Click (Race Condition)

**Scenario**: Senior taps BID NOW but another user submits higher bid 50ms earlier (not yet reflected in UI).

**Steps**:
```bash
# Terminal 1: Start app
npm run web

# Terminal 2: Mock API responses
curl -X POST http://localhost:3000/api/bids \
  -H 'Content-Type: application/json' \
  -d '{"lotId":"lot-1","amount":101,"bidderId":"user-2","timestamp":"2025-10-26T12:00:00.000Z"}'

# Terminal 3: Simulate senior's bid 50ms later (stale currentBid=100)
curl -X POST http://localhost:3000/api/bids \
  -H 'Content-Type: application/json' \
  -d '{"lotId":"lot-1","amount":101,"bidderId":"user-1","timestamp":"2025-10-26T12:00:00.050Z"}'

# Expected: 409 CONFLICT with body {"currentBid":102,"message":"Outbid"}
# Actual (BidNowButton.tsx:62): Generic error sound, no UI update, senior confused
```

**Fix Required**: Check `error.status === 409`, dispatch `updateBidStatus`, show banner "Outbid! Current bid now $102".

---

## Repro B: Auction Closes Mid-Click (Client Time Drift)

**Scenario**: Senior's device clock is 2 minutes slow. Countdown shows "1:58 left" but server already closed auction.

**Steps**:
```bash
# Set device time (adjust OS settings or use browser DevTools)
# Device: 2025-10-26 12:00:00
# Server: 2025-10-26 12:02:00

# CountdownTimer.tsx:47 calculates diff using local Date.now():
# endTime = 2025-10-26 12:01:00 (server time)
# diff = 12:01:00 - 12:00:00 = 60000ms = "1:00" displayed
# Senior taps BID NOW

# Server response: 410 GONE
# Actual (BidNowButton.tsx:62): Generic error sound
```

**Expected**: Detect `error.status === 410`, show "Auction Closed" banner, move lot to `lostBids`.

**Fix Required**: Sync server time via `HEAD /api/ping`, store offset in Redux, use `Date.now() + timeOffset` in CountdownTimer.

---

## Repro C: Network Retry (Flaky Connection)

**Scenario**: Senior on slow 3G, bid request times out after 5s.

**Steps**:
```bash
# Throttle network in Chrome DevTools (Slow 3G, 500ms latency, 50kb/s)

# Tap BID NOW
# BidNowButton.tsx:61 calls onBid(101)
# Request times out after 5000ms
# Catch block (line 62) logs error, plays error sound, loading=false

# Senior re-taps BID NOW (no idempotency key)
# If first request succeeds late: 409 CONFLICT "duplicate bid"
```

**Expected**:
- Auto-retry on network timeout (max 3 attempts, exponential backoff 2s/4s/8s).
- Use `x-idempotency-key: uuid()` to prevent duplicate bids.
- Show persistent banner "Retrying bid..." with dismiss option.

**Fix Required**: Add retry logic to `src/api/bids.ts`, pass idempotency key in headers, handle 409 gracefully.

---

## Repro D: Optimistic UI Rollback

**Scenario**: Senior taps BID NOW, UI should immediately show "Your bid: $101" then rollback if declined.

**Current Behavior** (`BidNowButton.tsx:52`):
1. `setLoading(true)` → spinner shows
2. `await onBid(101)` → waits for server
3. If error: loading=false, bid never appears in Redux

**Expected**:
1. Dispatch optimistic `addBid({lotId, amount:101, isWinning:true, pending:true})`
2. Show "Submitting bid..." banner
3. On success: mark `pending:false`
4. On error: remove optimistic bid, show "Bid declined: [reason]"

**Fix Required**: Add `optimisticBidId` to BidNowButton state, dispatch on tap, rollback in catch block.
