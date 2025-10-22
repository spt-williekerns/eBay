/**
 * Bottom Tab Navigation
 *
 * Design Choices:
 * - Large tab icons: 64px for easy tapping
 * - High contrast: Red active state for visibility
 * - Dam icon theme: Kentucky Dam imagery
 * - Clear labels: Large 28pt font
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { BidsScreen } from '../screens/BidsScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { KentuckyLakeTheme } from '../theme/colors';
import { Spacing } from '../theme/spacing';

const Tab = createBottomTabNavigator();

/**
 * Tab Navigator Component
 *
 * Main navigation for the app
 */
export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: KentuckyLakeTheme.vibrantRed,
        tabBarInactiveTintColor: KentuckyLakeTheme.damGray,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Bids"
        component={BidsScreen}
        options={{
          tabBarLabel: 'BIDS',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>💰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          tabBarLabel: 'WATCH',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>⭐</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: KentuckyLakeTheme.backgroundLight,
    borderTopWidth: 2,
    borderTopColor: KentuckyLakeTheme.lakeBlue,
  },
  tabLabel: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  tabIcon: {
    marginTop: 4,
  },
  icon: {
    fontSize: 44, // Large icons for easy visibility
  },
  iconActive: {
    transform: [{ scale: 1.2 }],
  },
});
