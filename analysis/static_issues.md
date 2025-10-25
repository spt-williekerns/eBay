# Static Analysis Issues

## Type Safety (High Risk)
1. **navigation: any (5 screens)** - **Fact** HomeScreen.tsx:40, BidsScreen:42, etc. Typos undetected. Use `NativeStackNavigationProp`.
2. **command: any (HomeScreen:86)** - **Fact** VoiceCommand type exists (utils/voice.ts:8) but unused. Refactors break silently.
3. **window cast (voice.web.ts:19)** - **Fact** `(window as any).SpeechRecognition` bypasses checks. Check existence first.

## Hook Dependencies (React 18 Risk)
4. **Missing dispatch deps (4 screens)** - **Fact** useEffect([]) calls loadEvents→dispatch (HomeScreen:45, BidsScreen:49, etc). Stable but implicit.
5. **wonBids identity (BidsScreen:53)** - **Fact** useEffect checks wonBids.length but omits array from deps. Triggers on every Redux action.

## State Mutations
6. **In-place sort (watchlistSlice:83)** - **Fact** `state.lots.sort()` mutates directly. Immer-safe but non-idiomatic. Use `[...state.lots].sort()`.

## Config Gaps
7. **Incomplete strict (tsconfig:8)** - **Fact** `strict: true` set but @types/jest missing. Cannot verify.
8. **No ESLint** - **Fact** No .eslintrc found. Missing react-hooks/exhaustive-deps to catch #4, #5.

## Dead Code
9. **updateBidStatus orphan (bidSlice:75)** - **Fact** Reducer never called (grep negative). Remove or implement notifications.

## Starter Strict Config
**Proposal**: Add to tsconfig.json:
```json
"noUnusedLocals": true,
"noUnusedParameters": true
```
Already has: noImplicitAny, strictNullChecks (via strict:true).
