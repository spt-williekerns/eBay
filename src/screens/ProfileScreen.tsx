/**
 * Profile Screen - User Information
 *
 * Design Choices:
 * - Large text fields: Easy to read
 * - Clear labels: Email, Phone, Bidder ID prominently displayed
 * - Settings toggles: Large switches for easy interaction
 * - Town display: For leaderboard participation
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { updateUserProfile, updateSettings, logout } from '../store/slices/userSlice';
import { KentuckyLakeTheme } from '../theme/colors';
import { TextStyles } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../theme/colors';

/**
 * Profile Screen Component
 *
 * Displays user information and app settings
 */
export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { currentUser, settings } = useAppSelector((state) => state.user);

  // Mock user data if not authenticated
  const user = currentUser || {
    id: '1',
    bidderId: 'KC-12345',
    email: 'bidder@example.com',
    phone: '(270) 555-0123',
    name: 'John Smith',
    town: 'Benton, KY',
    totalWins: 12,
    totalBids: 47,
    memberSince: '2024-01-15',
  };

  /**
   * Toggle setting
   */
  const toggleSetting = (setting: keyof typeof settings) => {
    dispatch(updateSettings({ [setting]: !settings[setting] }));
  };

  /**
   * Navigate to leaderboard
   */
  const viewLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    dispatch(logout());
    // Navigate to login screen
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={Gradients.lake} style={styles.header}>
        <Text style={styles.headerTitle}>MY PROFILE</Text>
      </LinearGradient>

      {/* User Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>USER INFORMATION</Text>

        {/* Name */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        {/* Bidder ID */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Bidder ID:</Text>
          <Text style={[styles.value, styles.bidderId]}>{user.bidderId}</Text>
        </View>

        {/* Email */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        {/* Phone */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>

        {/* Town */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Town:</Text>
          <Text style={styles.value}>{user.town}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>BIDDING STATS</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user.totalWins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user.totalBids}</Text>
            <Text style={styles.statLabel}>Total Bids</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.leaderboardButton} onPress={viewLeaderboard}>
          <Text style={styles.leaderboardButtonText}>
            VIEW {user.town.split(',')[0].toUpperCase()} LEADERBOARD
          </Text>
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SETTINGS</Text>

        {/* Voice Input */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice Input</Text>
          <Switch
            value={settings.voiceEnabled}
            onValueChange={() => toggleSetting('voiceEnabled')}
            trackColor={{
              false: KentuckyLakeTheme.damGray,
              true: KentuckyLakeTheme.lakeBlue,
            }}
            thumbColor={KentuckyLakeTheme.white}
            ios_backgroundColor={KentuckyLakeTheme.damGray}
            style={styles.switch}
          />
        </View>

        {/* Sound Effects */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sound Effects</Text>
          <Switch
            value={settings.soundEnabled}
            onValueChange={() => toggleSetting('soundEnabled')}
            trackColor={{
              false: KentuckyLakeTheme.damGray,
              true: KentuckyLakeTheme.lakeBlue,
            }}
            thumbColor={KentuckyLakeTheme.white}
            ios_backgroundColor={KentuckyLakeTheme.damGray}
            style={styles.switch}
          />
        </View>

        {/* Notifications */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={() => toggleSetting('notificationsEnabled')}
            trackColor={{
              false: KentuckyLakeTheme.damGray,
              true: KentuckyLakeTheme.lakeBlue,
            }}
            thumbColor={KentuckyLakeTheme.white}
            ios_backgroundColor={KentuckyLakeTheme.damGray}
            style={styles.switch}
          />
        </View>

        {/* Haptic Feedback */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Haptic Feedback</Text>
          <Switch
            value={settings.hapticFeedback}
            onValueChange={() => toggleSetting('hapticFeedback')}
            trackColor={{
              false: KentuckyLakeTheme.damGray,
              true: KentuckyLakeTheme.lakeBlue,
            }}
            thumbColor={KentuckyLakeTheme.white}
            ios_backgroundColor={KentuckyLakeTheme.damGray}
            style={styles.switch}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LOG OUT</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KentuckyLakeTheme.backgroundDark,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.screen.horizontal,
  },
  headerTitle: {
    ...TextStyles.h1,
    color: KentuckyLakeTheme.white,
  },
  section: {
    backgroundColor: KentuckyLakeTheme.backgroundLight,
    marginHorizontal: Spacing.screen.horizontal,
    marginVertical: Spacing.md,
    borderRadius: 16,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: KentuckyLakeTheme.lakeBlue,
    marginBottom: Spacing.md,
  },
  infoRow: {
    marginVertical: Spacing.sm,
  },
  label: {
    fontSize: 32,
    fontWeight: '600',
    color: KentuckyLakeTheme.damGray,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: 38,
    fontWeight: '500',
    color: KentuckyLakeTheme.textDark,
  },
  bidderId: {
    fontSize: 42,
    fontWeight: '700',
    color: KentuckyLakeTheme.vibrantRed,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Spacing.md,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: KentuckyLakeTheme.lakeBlue,
    borderRadius: 16,
    padding: Spacing.lg,
    minWidth: 150,
  },
  statValue: {
    fontSize: 56,
    fontWeight: '900',
    color: KentuckyLakeTheme.white,
  },
  statLabel: {
    fontSize: 32,
    fontWeight: '600',
    color: KentuckyLakeTheme.cream,
    marginTop: Spacing.xs,
  },
  leaderboardButton: {
    backgroundColor: KentuckyLakeTheme.fireflyGold,
    height: Spacing.touchTarget.button,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  leaderboardButtonText: {
    fontSize: 36,
    fontWeight: '700',
    color: KentuckyLakeTheme.textDark,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: KentuckyLakeTheme.damGray + '30',
  },
  settingLabel: {
    fontSize: 38,
    fontWeight: '600',
    color: KentuckyLakeTheme.textDark,
    flex: 1,
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], // Larger for seniors
  },
  logoutButton: {
    backgroundColor: KentuckyLakeTheme.error,
    height: Spacing.touchTarget.button,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.screen.horizontal,
    marginVertical: Spacing.lg,
  },
  logoutButtonText: {
    ...TextStyles.button,
    color: KentuckyLakeTheme.white,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});
