/**
 * Leaderboard Screen - Town-Based Rankings
 *
 * Design Choices:
 * - Town-based rankings: Creates local competition
 * - Badges: "Nashville's #1 Bidder" etc for excitement
 * - Large rankings: Easy to read
 * - Celebration: Highlights user's position
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { setTownLeaderboard, setGlobalLeaderboard } from '../store/slices/leaderboardSlice';
import { LeaderboardEntry } from '../types';
import { KentuckyLakeTheme } from '../theme/colors';
import { TextStyles } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/formatters';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../theme/colors';

type LeaderboardTab = 'town' | 'global';

/**
 * Leaderboard Screen Component
 *
 * Shows town-based and global rankings
 */
export const LeaderboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { townLeaderboard, globalLeaderboard, userTownRank, userRank, selectedTown } =
    useAppSelector((state) => state.leaderboard);
  const { currentUser } = useAppSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState<LeaderboardTab>('town');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  /**
   * Load leaderboard data
   */
  const loadLeaderboard = async () => {
    try {
      // In production, fetch from API
      const mockTownLeaderboard = generateMockTownLeaderboard();
      const mockGlobalLeaderboard = generateMockGlobalLeaderboard();

      dispatch(
        setTownLeaderboard({
          town: currentUser?.town || 'Benton, KY',
          entries: mockTownLeaderboard,
        })
      );
      dispatch(setGlobalLeaderboard(mockGlobalLeaderboard));
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  /**
   * Get current tab data
   */
  const getCurrentData = (): LeaderboardEntry[] => {
    return selectedTab === 'town' ? townLeaderboard : globalLeaderboard;
  };

  /**
   * Get rank display with emoji
   */
  const getRankDisplay = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  /**
   * Render leaderboard entry
   */
  const renderEntry = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isCurrentUser = item.userId === currentUser?.id;

    return (
      <View
        style={[
          styles.entryCard,
          isCurrentUser && styles.entryCardHighlight,
          index < 3 && styles.topThree,
        ]}
      >
        {/* Rank */}
        <Text style={[styles.rank, isCurrentUser && styles.rankHighlight]}>
          {getRankDisplay(item.rank)}
        </Text>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={[styles.name, isCurrentUser && styles.nameHighlight]}>
            {item.name}
            {isCurrentUser && ' (You)'}
          </Text>
          <Text style={styles.town}>{item.town}</Text>
          {item.badge && <Text style={styles.badge}>🏆 {item.badge}</Text>}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={[styles.wins, isCurrentUser && styles.winsHighlight]}>
            {item.totalWins} Wins
          </Text>
          <Text style={styles.amount}>{formatCurrency(item.totalBidAmount)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={Gradients.sunset} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>LEADERBOARD</Text>

        {selectedTab === 'town' && (
          <Text style={styles.townName}>{selectedTown}</Text>
        )}
      </LinearGradient>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'town' && styles.tabSelected]}
          onPress={() => setSelectedTab('town')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'town' && styles.tabTextSelected,
            ]}
          >
            MY TOWN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'global' && styles.tabSelected]}
          onPress={() => setSelectedTab('global')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'global' && styles.tabTextSelected,
            ]}
          >
            GLOBAL
          </Text>
        </TouchableOpacity>
      </View>

      {/* Your Rank Banner */}
      <View style={styles.yourRankBanner}>
        <Text style={styles.yourRankText}>
          Your Rank:{' '}
          <Text style={styles.yourRankNumber}>
            {selectedTab === 'town'
              ? userTownRank || '-'
              : userRank || '-'}
          </Text>
        </Text>
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={getCurrentData()}
        renderItem={renderEntry}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

/**
 * Generate mock leaderboard data
 */
const generateMockTownLeaderboard = (): LeaderboardEntry[] => [
  {
    rank: 1,
    userId: '101',
    name: 'Mary Johnson',
    town: 'Benton, KY',
    totalWins: 45,
    totalBidAmount: 12500,
    badge: "Benton's #1 Bidder",
  },
  {
    rank: 2,
    userId: '1', // Current user
    name: 'John Smith',
    town: 'Benton, KY',
    totalWins: 12,
    totalBidAmount: 3200,
  },
  {
    rank: 3,
    userId: '102',
    name: 'Robert Davis',
    town: 'Benton, KY',
    totalWins: 8,
    totalBidAmount: 2100,
  },
];

const generateMockGlobalLeaderboard = (): LeaderboardEntry[] => [
  {
    rank: 1,
    userId: '201',
    name: 'Sarah Williams',
    town: 'Nashville, TN',
    totalWins: 127,
    totalBidAmount: 45000,
    badge: "Nashville's #1 Bidder",
  },
  {
    rank: 2,
    userId: '202',
    name: 'Michael Brown',
    town: 'Paducah, KY',
    totalWins: 98,
    totalBidAmount: 38500,
  },
  {
    rank: 3,
    userId: '101',
    name: 'Mary Johnson',
    town: 'Benton, KY',
    totalWins: 45,
    totalBidAmount: 12500,
  },
];

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
  backButton: {
    marginBottom: Spacing.sm,
  },
  backText: {
    fontSize: 36,
    fontWeight: '700',
    color: KentuckyLakeTheme.white,
  },
  headerTitle: {
    ...TextStyles.h1,
    color: KentuckyLakeTheme.white,
  },
  townName: {
    fontSize: 36,
    fontWeight: '600',
    color: KentuckyLakeTheme.cream,
    marginTop: Spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KentuckyLakeTheme.backgroundLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: KentuckyLakeTheme.fireflyGold,
  },
  tabText: {
    fontSize: 36,
    fontWeight: '700',
    color: KentuckyLakeTheme.damGray,
  },
  tabTextSelected: {
    color: KentuckyLakeTheme.textDark,
  },
  yourRankBanner: {
    backgroundColor: KentuckyLakeTheme.lakeBlue,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.screen.horizontal,
    alignItems: 'center',
  },
  yourRankText: {
    fontSize: 38,
    fontWeight: '600',
    color: KentuckyLakeTheme.white,
  },
  yourRankNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: KentuckyLakeTheme.fireflyGold,
  },
  listContent: {
    paddingVertical: Spacing.md,
  },
  entryCard: {
    flexDirection: 'row',
    backgroundColor: KentuckyLakeTheme.backgroundLight,
    marginHorizontal: Spacing.screen.horizontal,
    marginVertical: Spacing.sm,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
  },
  entryCardHighlight: {
    backgroundColor: KentuckyLakeTheme.skyBlue,
    borderWidth: 3,
    borderColor: KentuckyLakeTheme.fireflyGold,
  },
  topThree: {
    borderLeftWidth: 8,
    borderLeftColor: KentuckyLakeTheme.fireflyGold,
  },
  rank: {
    fontSize: 52,
    fontWeight: '900',
    color: KentuckyLakeTheme.lakeBlue,
    minWidth: 80,
  },
  rankHighlight: {
    color: KentuckyLakeTheme.white,
  },
  userInfo: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  name: {
    fontSize: 38,
    fontWeight: '700',
    color: KentuckyLakeTheme.textDark,
  },
  nameHighlight: {
    color: KentuckyLakeTheme.white,
  },
  town: {
    fontSize: 32,
    fontWeight: '500',
    color: KentuckyLakeTheme.damGray,
    marginTop: Spacing.xs,
  },
  badge: {
    fontSize: 28,
    fontWeight: '600',
    color: KentuckyLakeTheme.fireflyGold,
    marginTop: Spacing.xs,
  },
  stats: {
    alignItems: 'flex-end',
  },
  wins: {
    fontSize: 36,
    fontWeight: '700',
    color: KentuckyLakeTheme.success,
  },
  winsHighlight: {
    color: KentuckyLakeTheme.white,
  },
  amount: {
    fontSize: 32,
    fontWeight: '600',
    color: KentuckyLakeTheme.damGray,
    marginTop: Spacing.xs,
  },
});
