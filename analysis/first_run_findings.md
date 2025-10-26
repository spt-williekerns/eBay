# First-Run & Registration Usability Findings

## Critical Blocker

**Fact**: No registration/onboarding (`RootNavigator.tsx:29` goes to TabNavigator, `ProfileScreen.tsx:38` mock user). Seniors land on events with no context.

## Copy/Label Blockers → Fixes

1. **Tab label** (`TabNavigator.tsx:64`) "WATCH" → "MY WATCHLIST"
2. **Jargon** (`ProfileScreen.tsx:191`) "Haptic Feedback" → "Button Vibration"
3. **Unclear label** (`ProfileScreen.tsx:91`) "Bidder ID:" → "Your Bidder Number:"
4. **No context** (`ProfileScreen.tsx:143`) "Voice Input" → "Talk to Bid (say 'Bid Now')"
5. **Silent errors** (`HomeScreen.tsx:68`) `console.error` only → Add `aria-live="polite"` banner
6. **Logout shown** (`ProfileScreen.tsx:208`) when `!isAuthenticated` → Hide logout button
7. **Stats unclear** (`ProfileScreen.tsx:120`) "Wins" shown when totalBids=0 → Add "Start Bidding!" CTA
8. **ALL CAPS** (`ProfileScreen.tsx:81`) "USER INFORMATION" → "My Information"
9. **Vague** (`ProfileScreen.tsx:159`) "Sound Effects" → "Bid Sounds & Alerts"
10. **No feedback** - Settings changes silent → Add "Settings Saved ✓" toast

## Structural Blockers → Fixes

1. **No welcome** (`RootNavigator.tsx:29` no conditional) → Add WelcomeModal on first launch
2. **No error region** (Grep: no `aria-live`) → Add `<View role="alert" aria-live="polite">` in HomeScreen
3. **No confirmations** - Bid/settings lack feedback → Add SuccessModal with checkmark
