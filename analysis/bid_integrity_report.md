# Bidding & Countdown Integrity Audit

## Client Time Authority (CRITICAL)

**Fact**: CountdownTimer uses `Date.now()` (`CountdownTimer.tsx:47`) vs server `endTime`.
**Fact**: No server time sync (Glob: no `timeOffset`/`ntp` files).
**Consequence**: Clock drift = seniors bid on closed auctions or miss alerts (`CountdownTimer.tsx:72-84`).

## Bid Flow Path (NO IMPLEMENTATION)

**Fact**: `BidNowButton` exists (`BidNowButton.tsx:48-67`) but never imported (Grep: only test file).
**Fact**: No API (Glob: no `/api/` dir). `addBid` reducer (`bidSlice.ts:33`) never dispatched.
**Consequence**: Bidding **non-functional**.

## Missing Integrity Safeguards

**Fact**: No idempotency (`BidNowButton.tsx:61`). Double-tap = duplicate bids.
**Fact**: No retry (`BidNowButton.tsx:62-64` generic catch, error sound). Network drop = lost bid.
**Fact**: No 409/410 handling. Outbid/Closed indistinguishable from errors.
**Fact**: `updateBidStatus` orphaned (`bidSlice.ts:75`, `static_issues.md:20`). No outbid alerts.

## Optimistic UI (ABSENT)

**Fact**: Loading spinner (`BidNowButton.tsx:77-78`) but no optimistic update or rollback.
**Consequence**: Rejection invisible, stale bid shown.

## Cache Staleness (Redundant with offline_audit.md)

**Fact**: 24hr cache (`storage.web.ts:9`). Stale `currentBid` if offline >1min.

## Summary: Can Client Time Influence Outcomes?

**YES** (CountdownTimer) but **moot** (no server). When implemented: wrong clock = late alerts, bids on closed auctions (410 GONE).
