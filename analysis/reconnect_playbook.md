# Reconnect Reconciliation Playbook

## Detection Strategy

**Assumption**: No online/offline listeners exist.
**Action**: Add `window.addEventListener('online', handleReconnect)` in web entry.

## Reconciliation Steps (Priority Order)

1. **Active bids** (`BidsScreen.tsx:49-51`) — Refetch via API to get latest `currentBid`, `finalPrice`, and `status`. Critical: seniors must see if they were outbid.
2. **Watchlist lots** (`storage.web.ts:74`) — Refresh `endTime` and `currentBid` to fix countdown timers (`CountdownTimer.tsx:47` uses client-side `Date.now()`).
3. **Won/Lost state** (`bidSlice.ts:50-56`) — Server determines win/loss; local optimistic flags must be cleared and replaced with server truth.
4. **Event schedules** (`storage.web.ts:71`) — Lower priority; refresh to catch new auctions but won't affect active bidding.

## Stale State Banner

**Display**: `"⚠️ Reconnected. Refreshing auction data..."` (4 seconds, then auto-dismiss).
**Location**: Top of `BidsScreen` and `WatchlistScreen` (highest risk for stale "you're winning").
**Dismiss**: Automatic after refetch completes; no user action required (senior-friendly).

## Minimal Code Touch

Add `useNetInfo()` hook (react-native-community/netinfo) to `BidsScreen.tsx` and `WatchlistScreen.tsx` only. Call `dispatch(refreshActiveBids())` on reconnect.
