# Implementation Guide

This document explains how to get the Marshall County Auction App running and provides implementation details for key features.

## 🚦 Quick Start

### Prerequisites
```bash
- Node.js 18+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
```

### Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **iOS Setup**
```bash
cd ios
pod install
cd ..
```

3. **Add Sound Files**
Place banjo sound files in:
- iOS: `ios/[YourAppName]/sounds/`
- Android: `android/app/src/main/res/raw/`

Required files:
- bid_placed.mp3
- bid_won.mp3
- bid_lost.mp3
- timer_warning.mp3
- timer_urgent.mp3
- timer_ended.mp3
- button_tap.mp3
- success.mp3
- error.mp3

4. **Configure Voice Permissions**

**iOS** - Add to `ios/[YourAppName]/Info.plist`:
```xml
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need access to speech recognition for voice bidding</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice commands</string>
```

**Android** - Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

5. **Run the App**
```bash
# iOS
npm run ios

# Android
npm run android
```

## 🔧 Key Implementation Details

### 1. Redux State Management (No Refreshes!)

**Location**: `src/store/`

All state changes happen through Redux actions. No page refreshes means:
- Users never lose their place
- Forms don't reset unexpectedly
- Smooth, predictable experience

Example bid flow:
```typescript
// User taps BID NOW
dispatch(addBid(newBid));           // Updates state
dispatch(updateLotBid({ lotId, newBid })); // Updates lot
// Screen auto-updates via Redux selectors - NO REFRESH!
```

### 2. Offline Caching

**Location**: `src/utils/storage.ts`

AsyncStorage caches data with 24-hour expiry:

```typescript
// Save events for offline access
await StorageHelpers.saveEvents(events);

// Load events (returns cached if available)
const events = await StorageHelpers.loadEvents();
```

### 3. Voice Input Integration

**Location**: `src/utils/voice.ts`

Natural language command parsing:

```typescript
// Start listening
await voiceManager.startListening();

// Parse command
const command = voiceManager.parseCommand("bid fifty dollars");
// Returns: { type: 'bid', amount: 50 }
```

Supported commands:
- Bidding: "bid [amount] dollars"
- Navigation: "go to [screen name]"
- Search: "search [query]"

### 4. One-Tap Bidding

**Location**: `src/components/bidding/BidNowButton.tsx`

Critical for senior UX - no confirmation needed:

```typescript
<BidNowButton
  currentBid={100}
  increment={1}        // $1 increments
  onBid={handleBid}   // Async bid function
/>
```

Features:
- Automatic increment (+$1)
- Haptic feedback
- Sound effects
- Loading state
- 80px height (easy to tap)

### 5. Mass Delete Fix

**Location**: `src/store/slices/watchlistSlice.ts`

Original app lacked mass-delete. Implementation:

```typescript
// Toggle selection mode
<TouchableOpacity onPress={toggleSelectionMode}>
  <Text>SELECT</Text>
</TouchableOpacity>

// Select all
dispatch(selectAllItems());

// Delete selected
dispatch(massDeleteFromWatchlist(selectedItemIds));
```

### 6. Always-Visible Prices (Bug Fix)

**Location**: `src/components/common/LotCard.tsx`

CRITICAL: Max bid and final prices must always be visible:

```typescript
// Max Bid - ALWAYS SHOWN
{showMaxBid && lot.maxBid && (
  <Text>Your Max Bid: {formatCurrency(lot.maxBid)}</Text>
)}

// Final Price - ALWAYS SHOWN on lost lots
{showFinalPrice && lot.finalPrice && lot.status === 'lost' && (
  <Text>Final Price: {formatCurrency(lot.finalPrice)}</Text>
)}
```

### 7. Animations

**Fireworks** (`src/components/animations/FireworksAnimation.tsx`):
- Triggers on bid wins
- 20 particles with random trajectories
- 3-second duration

**Firefly Glow** (`src/components/animations/FireflyGlow.tsx`):
- 10-15 fireflies with pulsing glow
- Kentucky summer night theme
- Infinite loop while winning

**Wave Animation** (`src/components/animations/WaveAnimation.tsx`):
- Lottie-based water ripple
- Triggers on bid placement
- 1.5-second duration

### 8. Countdown Timer with Sounds

**Location**: `src/components/common/CountdownTimer.tsx`

Progressive urgency system:

```typescript
// 30 seconds: Warning sound + yellow color
if (seconds <= 30) {
  setUrgency('warning');
  soundManager.playSound(Sounds.TIMER_WARNING);
}

// 10 seconds: Urgent buzzer + red color + shake animation
if (seconds <= 10) {
  setUrgency('urgent');
  soundManager.playSound(Sounds.TIMER_URGENT);
  timerRef.current?.shake(800);
}

// 0 seconds: Air horn + ended state
if (seconds === 0) {
  soundManager.playSound(Sounds.TIMER_ENDED);
  onExpire();
}
```

### 9. Town Leaderboard

**Location**: `src/screens/LeaderboardScreen.tsx`

Creates local competition:

```typescript
// Fetch town-specific rankings
dispatch(setTownLeaderboard({
  town: currentUser.town,  // e.g., "Benton, KY"
  entries: townRankings
}));

// Display user's town rank
<Text>Your Town Rank: #{userTownRank}</Text>
```

Badges awarded:
- #1: "[Town]'s #1 Bidder"
- Top 3: Medal emojis (🥇🥈🥉)

### 10. AR Preview

**Location**: `src/components/ar/ARLotPreview.tsx`

3D lot visualization (requires ViroReact setup):

```typescript
// In production, integrate ViroReact:
<ViroARSceneNavigator
  initialScene={{
    scene: ARScene,
  }}
/>
```

Current implementation shows activation UI and instructions.

## 🎨 Customizing the Theme

**Location**: `src/theme/colors.ts`

To change colors:

```typescript
export const KentuckyLakeTheme = {
  lakeBlue: '#1E5F8C',      // Change primary color
  vibrantRed: '#E63946',    // Change action color
  // ... modify other colors
};
```

**Location**: `src/theme/typography.ts`

To adjust font sizes:

```typescript
fontSize: {
  jumbo: 56,      // Prices, countdowns
  huge: 48,       // Page titles
  large: 44,      // Section headers
  base: 40,       // Body text (MINIMUM)
  small: 36,      // Secondary text
}
```

⚠️ **WARNING**: Do not go below 40pt for body text! This breaks senior accessibility.

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Key Test Files
- `BidNowButton.test.tsx`: One-tap bidding
- `VoiceInput.test.tsx`: Voice command parsing
- `Watchlist.test.tsx`: Mass-delete functionality
- `BidSlice.test.tsx`: Final price visibility (bug fix)

## 🔌 API Integration

**Location**: `src/screens/*.tsx` (mock data sections)

Replace mock data with API calls:

```typescript
// Current (mock):
const mockEvents = generateMockEvents();
dispatch(setEvents(mockEvents));

// Production:
const response = await fetch('https://api.example.com/events');
const events = await response.json();
dispatch(setEvents(events));
```

API endpoints needed:
- `GET /events` - List auctions by location
- `GET /lots` - List lots for event
- `POST /bids` - Place bid
- `GET /user/bids` - User's bid history
- `GET /leaderboard/:town` - Town rankings

## 📱 Platform-Specific Notes

### iOS
- Requires Xcode 14+
- Test on iPhone 8+ (senior users often have older devices)
- Enable VoiceOver testing for accessibility

### Android
- Min SDK: 21 (Android 5.0)
- Test on devices with large screens (seniors prefer tablets)
- Enable TalkBack testing for accessibility

## 🚨 Common Issues

### 1. Voice Input Not Working
- Check microphone permissions
- Test on physical device (not simulator)
- Verify react-native-voice installation

### 2. Sounds Not Playing
- Ensure sound files are in correct directories
- Check Sound.setCategory is called
- Verify file names match imports

### 3. Animations Laggy
- Enable Hermes engine
- Check for console warnings
- Test on physical device (simulators can be slow)

### 4. Redux State Not Updating
- Check action creators are dispatched
- Verify reducers are returning new state
- Use Redux DevTools for debugging

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Senior UX Best Practices](https://www.nngroup.com/articles/usability-for-senior-citizens/)
- [Lottie Files](https://lottiefiles.com/)

## 🤝 Support

For questions or issues:
1. Check this guide
2. Review README.md
3. Check inline code comments
4. Create an issue on GitHub

---

**Remember**: This app is designed for seniors. Always prioritize:
- ✅ Large fonts (40pt+)
- ✅ High contrast (WCAG AAA)
- ✅ Simple flows (3 taps max)
- ✅ Clear feedback (haptic, audio, visual)
- ✅ Reliability (no unexpected refreshes)
