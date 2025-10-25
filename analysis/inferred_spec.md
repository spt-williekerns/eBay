# Inferred Specification (From Code)

## Use Cases

**Fact**: 5 flows (src/navigation/TabNavigator.tsx:27-63): Browse events by location, Place bid (+$1 increment), Track active/won/lost, Manage watchlist (sort/mass-delete), View town leaderboard.

**Assumption**: No auth flow (no login slices, src/store/index.ts:12-17).

## Domain Objects & Invariants

**Fact**: User (bidderId, town), AuctionEvent (location, dates), AuctionLot (currentBid, maxBid?, finalPrice?, endTime), Bid (amount, isWinning), WatchlistItem (src/types/index.ts:8-68).

**Critical Invariants**:
- `finalPrice` always visible on lost lots (src/store/slices/bidSlice.ts:70)
- `autoRefresh: false` — no screen refreshes (src/types/index.ts:88)

## State Transitions & Timing

**Fact**: Lot flow `active → won/lost` via manual actions (src/store/slices/bidSlice.ts:53-73). Client countdown compares `Date.now()` vs `endTime`, audio at 30s/10s/0s (src/components/common/CountdownTimer.tsx:47-89).

**IIUC Q1**: No timer trigger for won/lost. Server polling expected?
**IIUC Q2**: Client time authority (no NTP) — wrong device clock = wrong close time?

## Paths & Error Handling

**Happy path** (src/components/bidding/BidNowButton.tsx:48-67): Tap BID NOW → vibrate+sound → `onBid(currentBid+1)` → no confirmation.

**IIUC Q3**: `onBid` async but no Redux dispatch. How does bid enter state?

**Error path** (line 62-64): Generic catch → console.error + error sound. No NETWORK/CONFLICT/CLOSED/RATE_LIMIT handling.

**Outbid**: `updateBidStatus` exists (src/store/slices/bidSlice.ts:75) but **no caller found**.

**IIUC Q4**: How to notify outbid without refresh/polling?

## MVP Definition (Seniors)

**Proposed "Done"**:
1. Browse→tap lot→BID NOW = 3 taps (README claim, code allows 2-tap: HomeScreen→LotCard→BidNow)
2. Max bid visible (src/components/common/LotCard.tsx:102)
3. Final price on lost (src/store/slices/bidSlice.ts:70)
4. Sound+vibration feedback (src/components/bidding/BidNowButton.tsx:55-58)

**Blockers**: No server integration (mock data: src/screens/HomeScreen.tsx:63), no network error UX, no outbid notification.

## Key Ambiguities

**IIUC Q5**: Auth — how users get bidderId? Mock only (src/screens/ProfileScreen.tsx:19).
**IIUC Q6**: Bid API — `onBid()` signature exists but no fetch/axios implementation found.
