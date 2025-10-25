# Consensus Backlog (MoSCoW + RICE)

## Top 3 Per Bucket

**Correctness**
1. MUST: Fix Babel config `webpack.config.js:25` invalid plugin. **Fact** (risk_heatmap:H2). RICE: R=100,I=3,C=100%,E=0.5d. Exit: build succeeds.
2. MUST: Implement onBid API (BidNowButton.tsx:61 no fetch). **Fact** (inferred_spec:Q6). R=100,I=3,C=80%,E=3d. Depends: auth. Exit: bid in Redux.
3. SHOULD: Add 9 sounds + favicon (sound.web.ts:13). **Fact** (risk_heatmap:H1). R=100,I=1,C=100%,E=1d. Exit: no 404s.

**Security**
1. SHOULD: Input sanitization (no lib in package.json). **Assumption**. R=100,I=2,C=70%,E=2d. Exit: numbers-only bids.
2. N/A: No secrets found (risk_heatmap:L1). **Fact**.

**Privacy**
1. MUST: Privacy policy (types:10-11 stores email/bidderId). **Assumption**. R=100,I=2,C=90%,E=1d. Exit: footer link.
2. SHOULD: Encrypt localStorage (storage.web.ts plain text). **Fact**. R=100,I=1,C=80%,E=2d.

**Accessibility (Seniors)**
1. MUST: Verify 40pt fonts (typography.ts:50 needs device test). **Fact**. R=100,I=3,C=60%,E=1d. Exit: measured px ≥40.
2. SHOULD: Voice web compat (voice.web.ts untested). **Fact** (dep_graph). R=50,I=2,C=50%,E=3d. Exit: Chrome/Safari work.
3. SHOULD: Screen reader audit (no aria-labels). **Assumption**. R=30,I=2,C=70%,E=2d.

**Reliability**
1. MUST: Network errors (BidNowButton:62 generic catch). **Fact** (inferred_spec). R=100,I=3,C=90%,E=2d. Exit: retry dialog.
2. MUST: Server time (CountdownTimer:47 uses Date.now()). **Fact** (inferred_spec:Q2). R=100,I=3,C=100%,E=3d. Exit: server endTime.
3. SHOULD: Outbid notify (bidSlice:75 never called). **Fact** (inferred_spec:Q4). R=80,I=2,C=60%,E=5d. Depends: WebSocket. Exit: "Outbid!" <10s.

**Performance**
1. SHOULD: Remove viro (package.json:38 deprecated 2MB). **Assumption** (dep_graph). R=100,I=1,C=90%,E=0.5d. Exit: bundle <2MB.
2. COULD: Code split (webpack:9 single bundle). **Fact**. R=100,I=1,C=80%,E=2d.

**DevEx**
1. MUST: Install @babel/preset-typescript (webpack:23 missing). **Fact** (dep_graph). R=5,I=3,C=100%,E=0.1d. Exit: npm install ok.
2. SHOULD: Native setup (no ios/android dirs). **Fact** (risk_heatmap). R=20,I=2,C=100%,E=5d. Exit: npm run ios works.
3. COULD: Test coverage (4 vs 45 files). **Assumption** (risk_heatmap:L2). R=5,I=1,C=80%,E=10d.

**Observability**
1. SHOULD: Error tracking (BidNowButton:63 console.error). **Fact**. R=100,I=2,C=90%,E=1d. Exit: Sentry live.
2. COULD: Analytics (no tracking). **Assumption**. R=50,I=1,C=70%,E=2d.

**Compliance**
1. MUST: WCAG audit (README claims unverified). **Assumption**. R=100,I=3,C=60%,E=3d. Exit: Axe passes.
2. SHOULD: Terms of service. **Assumption**. R=100,I=2,C=90%,E=2d.

---

## Critical Path (First Bid Success)
1. Deps (0.1d) → 2. Babel (0.5d) → 3. Assets (1d) → 4. onBid API+auth (3d) → 5. Network errors (2d) → 6. Fonts (1d) → 7. Server time (3d). **MVP: 10.6d**

**MoSCoW**: MUST=9 | SHOULD=10 | COULD=6
