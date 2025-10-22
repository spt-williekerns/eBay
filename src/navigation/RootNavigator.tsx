/**
 * Root Navigation
 *
 * Main navigation stack including modals and detail screens
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';

const Stack = createNativeStackNavigator();

/**
 * Root Navigator Component
 *
 * Manages all navigation including tabs and modals
 */
export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Main Tab Navigator */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Modal Screens */}
        <Stack.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{
            presentation: 'modal',
          }}
        />

        {/* Add other screens here:
         * - LotDetails
         * - EventDetails
         * - BidHistory
         * etc.
         */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
