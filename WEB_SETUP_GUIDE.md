# React Native Web Setup Guide

## Overview

Converting this app to run in a browser requires React Native Web, which translates React Native components to web equivalents.

## ⚠️ **What Won't Work on Web:**

1. **AR Preview** - Requires native camera APIs
2. **Native Voice Input** - Web Speech API works differently
3. **Haptic Feedback** - No vibration in browsers
4. **Native Sounds** - Need HTML5 Audio replacement
5. **AsyncStorage** - Need localStorage replacement

## ✅ **What Will Work:**

- All screens and navigation
- Redux state management
- Visual animations (Lottie, react-native-animatable)
- Touch interactions
- Most UI components

## 🚀 Setup Process

### Option 1: React Native Web (Webpack)

**1. Install Dependencies:**
```bash
npm install --save react-dom react-native-web
npm install --save-dev @babel/preset-react webpack webpack-cli webpack-dev-server html-webpack-plugin babel-loader
```

**2. Create `webpack.config.js`** (see file below)

**3. Create `public/index.html`** (see file below)

**4. Create `index.web.js`** entry point

**5. Update `package.json`:**
```json
{
  "scripts": {
    "web": "webpack serve --mode development",
    "build:web": "webpack --mode production"
  }
}
```

**6. Run:**
```bash
npm run web
```

**7. Deploy to Vercel/Netlify:**
```bash
npm run build:web
# Upload 'dist' folder
```

### Option 2: Expo (Easier!)

**1. Install Expo:**
```bash
npx expo install react-native-web react-dom @expo/webpack-config
```

**2. Create `app.json`** (see file below)

**3. Update `package.json`:**
```json
{
  "scripts": {
    "web": "expo start --web",
    "build:web": "expo build:web"
  }
}
```

**4. Run:**
```bash
npm run web
```

**5. Deploy:**
```bash
npm run build:web
# Deploys to 'web-build' folder
```

## 📝 Required File Changes

### Files to Modify:

1. **Voice Input** (`src/utils/voice.ts`):
```typescript
// Replace react-native-voice with Web Speech API
const recognition = new (window as any).webkitSpeechRecognition();
```

2. **Storage** (`src/utils/storage.ts`):
```typescript
// Replace AsyncStorage with localStorage
await AsyncStorage.setItem(key, value); // Before
localStorage.setItem(key, value);        // After
```

3. **Sounds** (`src/utils/sound.ts`):
```typescript
// Replace react-native-sound with HTML5 Audio
const audio = new Audio('/sounds/bid_placed.mp3');
audio.play();
```

4. **Haptic Feedback** (remove or mock):
```typescript
// Vibration.vibrate(50); // Remove
// Or use navigator.vibrate() if available
```

5. **Images** - Use web-compatible paths:
```typescript
<Image source={{ uri: '/images/logo.png' }} />
```

## 🎯 Recommended Approach: Expo Web

**Pros:**
- Easiest setup
- Handles most conversions automatically
- Built-in dev server
- Easy deployment

**Cons:**
- Some native features still need manual fixes
- Larger bundle size

## 📦 What I'll Create for You:

1. `webpack.config.js` - Webpack configuration
2. `public/index.html` - HTML entry point
3. `index.web.js` - Web entry point
4. `src/utils/voice.web.ts` - Web-compatible voice input
5. `src/utils/storage.web.ts` - Web-compatible storage
6. `src/utils/sound.web.ts` - Web-compatible sounds
7. `app.json` - Expo configuration (alternative)
8. `vercel.json` - Deployment config

## 🌐 Deployment Options

### Vercel (Recommended):
```bash
npm install -g vercel
vercel deploy
```
**Result:** https://your-app.vercel.app

### Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
**Result:** https://your-app.netlify.app

### GitHub Pages:
```json
// package.json
"homepage": "https://username.github.io/repo-name",
"scripts": {
  "predeploy": "npm run build:web",
  "deploy": "gh-pages -d dist"
}
```

## 📊 Estimated Work:

- **Easy Path (Expo)**: ~30 minutes setup
- **Full Path (Webpack)**: ~2 hours setup + testing
- **Feature Parity**: ~4-6 hours to fix all native features

## 💡 My Recommendation:

**Start with Expo Web** because:
1. Fastest to set up
2. Most features work out-of-box
3. Easy to preview (just run `expo start --web`)
4. Can still build native apps

Would you like me to set this up for you?
