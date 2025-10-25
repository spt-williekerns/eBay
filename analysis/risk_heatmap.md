# Risk Heatmap

## HIGH Severity

### H1: Missing Build Assets
**Fact**: 9 sound files referenced but missing
`src/utils/sound.web.ts:13` → `/sounds/bid_placed.mp3` (404)
`webpack.config.js:49` → `./public/favicon.ico` (missing)
**Impact**: Web build fails, runtime audio errors.

### H2: Invalid Babel Configuration
**Fact**: `babel-loader` plugin misconfigured
`webpack.config.js:25` → `plugins: ['react-native-web']` (not a Babel plugin)
**Correct**: Should be in `resolve.alias` only (line 41).
**Impact**: Webpack transpilation fails.

### H3: Native-Only Dependencies on Web
**Fact**: 3 imports will crash on web
`src/utils/voice.ts:5` → `import Voice from 'react-native-voice'` (native-only)
`src/utils/sound.ts:1` → `import Sound from 'react-native-sound'` (native-only)
`src/components/common/VoiceInputButton.tsx:3` → imports non-web voice util
**Assumption**: Webpack resolve doesn't prioritize `.web.ts` (extensions order: webpack.config.js:44).

## MEDIUM Severity

### M1: Environment Exposure (Expected)
**Fact**: `NODE_ENV` injected to client bundle
`webpack.config.js:52` → `process.env.NODE_ENV`
**Status**: Normal for React; not a secret. Label: **Fact - Not a risk**.

### M2: AsyncStorage Web Incompatibility
**Fact**: Native storage API used in screens
`src/screens/HomeScreen.tsx:37` → `StorageHelpers.loadEvents()` → AsyncStorage
**Mitigation**: `src/utils/storage.web.ts` exists but imports not redirected.

## LOW Severity

### L1: No Secrets Found
**Fact**: Zero `.env` files, zero hardcoded keys (bash grep output).
**Status**: Secure.

### L2: Test Coverage Gaps
**Assumption**: 4 test files cover <20% of 49 source files
`src/__tests__/*.test.tsx` (4 files) vs `src/**/*.tsx` (45 files).

## Build Script Readiness

**Fact**: `npm run web` will fail (3 issues):
1. Missing `@babel/preset-typescript` dep
2. Invalid babel plugin `react-native-web`
3. Missing favicon.ico asset

**Fact**: `npm run ios|android` will fail (0 native setup):
No `ios/` or `android/` directories exist (find output).
