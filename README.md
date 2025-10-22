# Marshall County Auction App

A senior-friendly React Native auction application themed around Marshall County, KY and Kentucky Lake, inspired by A-Stock Bids.

![Kentucky Lake Theme](https://img.shields.io/badge/Theme-Kentucky%20Lake-blue)
![Senior Friendly](https://img.shields.io/badge/Accessibility-Senior%20Friendly-green)
![React Native](https://img.shields.io/badge/React%20Native-0.73-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🎯 Overview

This app provides a **simple, accessible, and exciting** auction experience specifically designed for senior users. Every design decision prioritizes ease of use, visibility, and enjoyment.

## ✨ Key Features

### 📱 **Tab-Based Navigation**
- **Home**: Location-based auction events (e.g., "Benton, KY")
- **Bids**: Active/Won/Lost lots with clear categorization
- **Watchlist**: Sortable with mass-delete functionality
- **Profile**: Email, phone, bidder ID, and town leaderboard access

### 🎨 **Senior-Friendly UX**
- **40pt Minimum Font Size**: All text is large and readable
- **High Contrast**: Red/white color scheme (WCAG AAA compliant)
- **3-Tap Maximum**: Any action completes in 3 taps or less
- **No Auto-Refresh**: Prevents disorienting screen changes

### 💰 **Bidding Features**
1. **One-Tap "BID NOW" Button**
   - Automatically bids current price + $1
   - 80px height, impossible to miss
   - Haptic feedback on tap
   - No confirmation needed (optimized for speed)

2. **Swipe-Slider Bidding**
   - Alternative for custom bid amounts
   - Large slider (60px height)
   - Confirmation popup prevents accidents
   - Real-time bid preview

3. **Always-Visible Prices** (Bug Fix)
   - Max bid: Always shown on active lots
   - Final price: **Always shown on lost lots** (original bug fix)

### ♿ **Accessibility**
- **Voice Input** (Web Speech API)
  - "Bid fifty dollars"
  - "Go to watchlist"
  - "Search antique furniture"
- **Offline Caching** (AsyncStorage)
  - 24-hour cache for events/lots
  - Works without internet
- **Large Touch Targets**
  - Minimum 60px buttons
  - 80px primary actions

### 🎉 **Excitement Features**
- **Fireworks Animation**: Celebrates wins (react-native-animatable)
- **Firefly Glow**: Magical Kentucky summer night effect on wins
- **Lottie Wave Animations**: Smooth water ripples on bid placement
- **Loud Countdown Timers**:
  - 30 seconds: Warning sound (banjo)
  - 10 seconds: Urgent buzzer (repeating)
  - 0 seconds: Air horn
- **Town Leaderboards**: "Benton's #1 Bidder" badges

### 🌲 **Kentucky Lake Theme**
- **Colors**:
  - Lake Blue (#1E5F8C): Primary navigation
  - Forest Green (#2C5F2D): Secondary accents
  - Vibrant Red (#E63946): Action buttons
  - Firefly Gold (#FFD700): Magical effects
  - Wood tones (Walnut, Hickory, Oak): Rustic heritage
- **Sounds**: Banjo-themed audio alerts
- **Visual Elements**: Dam icons, wave animations

### 🔧 **Technical Features**
- **Redux Toolkit**: State management (no screen refreshes!)
- **TypeScript**: Full type safety
- **React Navigation**: Tab and stack navigation
- **Jest**: Comprehensive UI tests
- **AR Preview**: 3D lot visualization (ViroReact)

## 📁 Project Structure

```
src/
├── __tests__/           # Jest tests
│   ├── BidNowButton.test.tsx
│   ├── VoiceInput.test.tsx
│   ├── Watchlist.test.tsx
│   └── BidSlice.test.tsx
├── assets/
│   └── animations/
│       └── wave.json    # Lottie animation
├── components/
│   ├── animations/      # Fireworks, firefly, wave
│   ├── ar/             # AR preview
│   ├── bidding/        # BID NOW, slider, timer
│   └── common/         # Lot cards, voice button
├── navigation/
│   ├── TabNavigator.tsx
│   └── RootNavigator.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── BidsScreen.tsx
│   ├── WatchlistScreen.tsx
│   ├── ProfileScreen.tsx
│   └── LeaderboardScreen.tsx
├── store/
│   ├── slices/         # Redux slices
│   └── index.ts        # Store configuration
├── theme/
│   ├── colors.ts       # Kentucky Lake colors
│   ├── typography.ts   # 40pt+ fonts
│   └── spacing.ts      # Large touch targets
├── types/
│   └── index.ts        # TypeScript types
├── utils/
│   ├── storage.ts      # Offline caching
│   ├── voice.ts        # Voice input
│   ├── sound.ts        # Audio manager
│   └── formatters.ts   # Currency, time formatting
└── App.tsx             # Main entry point
```

## 🎓 Design Choices Explained

### 1. **Why 40pt Font Minimum?**
Seniors often have reduced vision. Studies show 40pt is the minimum comfortable reading size for ages 65+. We use 56pt for prices and countdowns for maximum visibility.

### 2. **Why Red/White High Contrast?**
- Red: High wavelength, easier to see with age-related vision loss
- White text on dark backgrounds: Reduces eye strain
- WCAG AAA compliant: Contrast ratio >7:1

### 3. **Why No Auto-Refresh?**
Screen changes are disorienting for seniors. Redux ensures state updates without page refreshes, creating a stable, predictable experience.

### 4. **Why Voice Input?**
Many seniors have:
- Difficulty with small keyboards
- Arthritis affecting typing
- Preference for natural language

Voice commands like "bid fifty dollars" are more intuitive than manual entry.

### 5. **Why Fireworks and Sounds?**
Auctions are exciting! We amplify that with:
- **Visual feedback**: Fireworks celebrate wins
- **Audio alerts**: Loud timers create urgency
- **Gamification**: Leaderboards encourage participation

### 6. **Why Mass-Delete?**
Original app lacked this feature. Seniors accumulate many watchlist items and need efficient bulk management.

### 7. **Why Kentucky Lake Theme?**
- **Local connection**: Marshall County, KY is home to Kentucky Dam
- **Familiarity**: Blues, greens, wood textures evoke the region
- **Cultural relevance**: Banjo sounds represent local heritage

### 8. **Why AR Preview?**
Helps seniors visualize items in their space before bidding, increasing confidence and reducing returns.

## 🚀 Installation

```bash
# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Type checking
npm run type-check
```

## 📋 Bug Fixes from Original App

### 1. **Max Bid Not Visible**
- **Problem**: Users couldn't see their max bid on active lots
- **Solution**: `showMaxBid={true}` on all lot cards (src/components/common/LotCard.tsx:102)

### 2. **Final Price Hidden on Lost Lots**
- **Problem**: Users couldn't see final selling price on lost bids
- **Solution**: Always show `finalPrice` on lost lots (src/store/slices/bidSlice.ts:87)

### 3. **No Mass-Delete in Watchlist**
- **Problem**: Had to delete items one by one
- **Solution**: Selection mode with mass-delete action (src/screens/WatchlistScreen.tsx:67)

### 4. **Screen Refreshes**
- **Problem**: Auto-refresh caused disorientation
- **Solution**: Redux state management with manual pull-to-refresh only

## 🎨 Theme Colors Reference

| Color | Hex | Usage |
|-------|-----|-------|
| Lake Blue | #1E5F8C | Primary navigation, buttons |
| Sky Blue | #4A90C4 | Gradients, accents |
| Forest Green | #2C5F2D | Secondary actions |
| Vibrant Red | #E63946 | BID NOW, alerts |
| Firefly Gold | #FFD700 | Win celebrations, badges |
| Dark Walnut | #3E2723 | Wood texture backgrounds |
| Dam Gray | #607D8B | Disabled states, borders |

## 📱 Compatibility

- **iOS**: 13.0+
- **Android**: API 21+ (Android 5.0+)
- **React Native**: 0.73
- **TypeScript**: 5.3

## 🔊 Sound Files Needed

Place these in `android/app/src/main/res/raw/` and `ios/`:

- `bid_placed.mp3` - Quick banjo strum
- `bid_won.mp3` - Triumphant melody
- `bid_lost.mp3` - Sad trombone
- `timer_warning.mp3` - Banjo warning (30s)
- `timer_urgent.mp3` - Loud buzzer (10s)
- `timer_ended.mp3` - Air horn
- `button_tap.mp3` - Subtle click
- `success.mp3` - Positive chime
- `error.mp3` - Error beep

## 🌊 Lottie Animations

The `wave.json` file is a placeholder. For production, use:
- **Wave animation**: Kentucky Lake water ripples
- **Firefly animation**: Glowing particles
- **Confetti animation**: Win celebration

Download from [LottieFiles](https://lottiefiles.com/) or create custom.

## 📖 Usage Examples

### Voice Commands
```
"Bid fifty dollars"        → Places $50 bid
"Go to watchlist"          → Navigates to watchlist
"Show my bids"             → Navigates to bids screen
"Search antique furniture" → Searches lots
```

### Bidding Flow (3 Taps Maximum)
```
1. Tap lot card → Opens details
2. Tap "BID NOW" → Places bid (done!)

OR for custom amount:
1. Tap lot card → Opens details
2. Adjust slider → Set custom amount
3. Tap "SUBMIT BID" → Confirm → Places bid
```

## 🤝 Contributing

This app is designed for **senior accessibility**. When contributing:

1. **Maintain large fonts** (40pt minimum)
2. **Keep high contrast** (WCAG AAA)
3. **Preserve 3-tap maximum** flow
4. **Test with voice input**
5. **Add comprehensive comments**

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **A-Stock Bids**: Inspiration for auction features
- **Marshall County, KY**: Theme and local culture
- **Senior UX Research**: Accessibility guidelines from AARP and W3C

---

**Built with ❤️ for seniors in Marshall County, Kentucky**

*"Making online auctions accessible, exciting, and easy for everyone."*
