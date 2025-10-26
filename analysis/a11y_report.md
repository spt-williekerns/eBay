# WCAG 2.2 AA Accessibility Audit

## Top 10 Defects Blocking First Bid

1. **No focus styles** - **Fact**: No `:focus` styles (Grep: only tab `focused`). BidNowButton, VoiceInputButton lack visible focus rings (`BidNowButton.tsx:71`). Keyboard users cannot see focus.

2. **Missing roles** - **Fact**: BidNowButton (`BidNowButton.tsx:71`) has no `accessibilityRole="button"`. Screen readers announce "unlabeled".

3. **No labels** - **Fact**: Zero `accessibilityLabel` found (Grep). BidNowButton (`BidNowButton.tsx:71`), VoiceInputButton (`VoiceInputButton.tsx:70`), tabs (`TabNavigator.tsx:40-79`) lack labels.

4. **Countdown silent** - **Fact**: CountdownTimer (`CountdownTimer.tsx:52`) has no `aria-live="polite"`. Screen readers miss 30s/10s urgency alerts.

5. **Switches unlabeled** - **Fact**: Switch (`ProfileScreen.tsx:144,160,176,193`) lacks `accessibilityLabel`. Reads "switch" not "Voice Input switch".

6. **Decorative emojis** - **Fact**: Tab emojis (`TabNavigator.tsx:46,56,66,76`) lack `accessibilityElementsHidden`. Screen readers say "House emoji Home button".

7. **Error region missing** - **Assumption**: HomeScreen error has `aria-live` in proposed diff (`first_run_findings.md:5`) but not implemented.

8. **Loading silent** - **Fact**: ActivityIndicator (`BidNowButton.tsx:78`) has no `accessibilityLabel`. Screen reader hears nothing.

9. **Touch targets OK** - **Fact**: button=80px, icon=64px (`spacing.ts:22-23`) exceed 44px. **No fix needed**.

10. **Contrast unverified** - **Assumption**: Colors claim AAA (`colors.ts:6`) but no ratios. damGray on backgroundLight may fail 4.5:1.
