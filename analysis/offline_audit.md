# Offline / PWA Caching Safety Audit

## Evidence Summary

**Fact**: No service worker exists (Glob search returned no results).
**Fact**: No PWA manifest (`public/index.html:1-82` lacks `<link rel="manifest">`).
**Fact**: No cache headers (`vercel.json:1-11` only has rewrites).
**Fact**: localStorage caches auction data for 24hr (`storage.web.ts:9`).
**Fact**: Cached keys: `events`, `lots`, `bids`, `watchlist` (`storage.web.ts:69-76`).
**Fact**: CountdownTimer uses client-side `Date.now()` (`CountdownTimer.tsx:47`), making stale `endTime` dangerous.
**Assumption**: Production will have `/api/**` endpoints (currently mock at `HomeScreen.tsx:63`).

## Allow / Warn / Deny Matrix

| Resource Type       | Cache Rule | Rationale (file:line) |
|---------------------|------------|----------------------|
| `/bundle.js`        | **ALLOW** (1yr) | Static build artifact (`webpack.config.js:9`). |
| `*.{png,jpg,svg}`   | **ALLOW** (1yr) | Image assets (`webpack.config.js:30-31`). |
| Google Fonts CDN    | **ALLOW** (1yr) | Third-party fonts (`public/index.html:12-14`). |
| `/api/**` (future)  | **DENY** (no-store) | Live auction data. **Critical**: Stale `currentBid` or `endTime` means seniors see "You're winning!" when auction ended. |
| localStorage `lots` | **WARN** (60s max) | 24hr cache (`storage.web.ts:9`) risks stale bids. Reduce to 1 minute. |
| localStorage `events`| **WARN** (5min max) | `endTime` drift causes timer errors. |
| Root `/` (HTML)     | **DENY** (no-cache) | Ensures updates propagate (`vercel.json:3`). |

## Current Risk

**HIGH**: 24-hour localStorage cache means seniors could bid on closed auctions or miss wins if offline >1 minute.
