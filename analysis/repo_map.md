# Repository Map

## Directory Structure

**Fact**: 49 TypeScript/JavaScript files organized in 4 categories (find output).

### Code (Entry Points)
```
index.js                    ← Native entry (package.json:5)
index.web.js                ← Web entry (webpack.config.js:6)
src/App.tsx                 ← Root component (index.js:3, index.web.js:2)
```

### Code (Source Tree)
```
src/
├── components/
│   ├── animations/         (3 files: Fireworks, Firefly, Wave)
│   ├── ar/                 (1 file: ARLotPreview)
│   ├── bidding/            (2 files: BidNowButton, SwipeSlider)
│   └── common/             (3 files: Timer, LotCard, VoiceButton)
├── navigation/             (2 files: Tab, Root navigators)
├── screens/                (5 files: Home, Bids, Watchlist, Profile, Leaderboard)
├── store/slices/           (5 files: Redux state management)
├── theme/                  (4 files: colors, typography, spacing)
├── types/                  (1 file: TypeScript definitions)
└── utils/                  (7 files: 4 native + 3 web variants)
```

### Config (Build Targets)
```
babel.config.js             ← Native builds
webpack.config.js           ← Web builds (package.json:10-11)
tsconfig.json               ← TypeScript compilation
jest.config.js              ← Test runner
vercel.json                 ← Web deployment
```

### Assets
```
src/assets/animations/wave.json  ← Lottie animation
public/index.html                ← Web HTML shell
```
**Assumption**: Sound files (*.mp3) missing but referenced (src/utils/sound.web.ts:13).

### Tests
```
src/__tests__/              (4 test suites: BidNow, Voice, Watchlist, BidSlice)
```

## Platform Split

**Native**: index.js → react-native CLI → iOS/Android
**Web**: index.web.js → webpack → dist/ → Vercel

**Fact**: Dual entry points enable cross-platform (package.json:7-11).
