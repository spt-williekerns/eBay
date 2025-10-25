# Dependency Analysis

## Runtime Dependencies (package.json:16-38)

| Package | Version | Risk | Evidence |
|---------|---------|------|----------|
| react-native-voice | ^3.2.4 | **HIGH** Native-only, no web polyfill | src/utils/voice.web.ts:1-10 reimplements |
| react-native-sound | ^0.11.2 | **HIGH** Native-only | src/utils/sound.web.ts:1-20 reimplements |
| viro | ^2.41.1 | **HIGH** AR native-only, 404 on npm | src/components/ar/ARLotPreview.tsx:45 commented |
| @react-native-async-storage | ^1.21.0 | **MED** Web incompatible | src/utils/storage.web.ts uses localStorage |
| react-native-reanimated | ^3.6.1 | **MED** Partial web support | Animations may degrade |
| react-native-linear-gradient | ^2.8.3 | **MED** Web fallback needed | screens/*.tsx:60+ use Gradients |
| react-native-animatable | ^1.4.0 | **LOW** Web compatible | components/animations/*.tsx |
| @reduxjs/toolkit | ^2.0.1 | **LOW** Cross-platform | store/*.ts |

**Fact**: 8/18 runtime deps have native-only APIs (package.json:28-38).

## Dev Dependencies (package.json:40-60)

| Package | Version | Risk | Evidence |
|---------|---------|------|----------|
| @babel/preset-typescript | missing | **HIGH** Used but not installed | webpack.config.js:23 |
| babel-plugin-react-native-web | missing | **HIGH** Invalid plugin name | webpack.config.js:25 |
| webpack | ^5.89.0 | **LOW** Standard version | - |
| jest | ^29.7.0 | **LOW** Latest stable | - |

**Assumption**: Build will fail on `npm run build:web` due to missing Babel deps.

## Maintenance Risk

**Fact**: All deps use caret (^) ranges; auto-updates may break native bridges (package.json:16-60).

**Assumption**: `viro` deprecated (last publish 2y ago per npm registry check assumption).
