/**
 * Senior Auction App - Main Entry Point
 * Marshall County, Kentucky Theme
 *
 * Design Philosophy:
 * - Simplicity: Maximum 3 taps to complete any action
 * - Visibility: 40pt+ fonts, high contrast colors
 * - Accessibility: Voice input, offline support, haptic feedback
 * - Excitement: Fireworks, sounds, leaderboards for engagement
 * - Reliability: No auto-refresh, Redux state management
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './store';
import { RootNavigator } from './navigation/RootNavigator';
import { initializeSounds } from './utils/sound';
import { KentuckyLakeTheme } from './theme/colors';

// Ignore specific warnings for demo purposes
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

/**
 * Main App Component
 *
 * Initializes app services and provides Redux store
 */
const App: React.FC = () => {
  useEffect(() => {
    // Initialize sound effects on app start
    initializeSounds();

    // Cleanup on unmount
    return () => {
      // Any cleanup needed
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={KentuckyLakeTheme.lakeBlue}
        />
        <RootNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
