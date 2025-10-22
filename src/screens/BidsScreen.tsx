/**
 * Bids Screen - Active/Won/Lost Lots
 *
 * Design Choices:
 * - Tab-based navigation: Clear separation of bid states
 * - Always show max bid and final price (bug fix!)
 * - Large tabs: Easy to tap and switch
 * - Fireworks on wins: Celebration and excitement
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveBids, setWonBids, setLostBids } from '../store/slices/bidSlice';
import { AuctionLot } from '../types';
import { KentuckyLakeTheme } from '../theme/colors';
import { TextStyles } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { LotCard } from '../components/common/LotCard';
import { FireworksAnimation } from '../components/animations/FireworksAnimation';
import { FireflyGlow } from '../components/animations/FireflyGlow';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../theme/colors';
import { StorageHelpers } from '../utils/storage';

const { width } = Dimensions.get('window');

type BidTab = 'active' | 'won' | 'lost';

/**
 * Bids Screen Component
 *
 * Shows user's bids categorized by status
 */
export const BidsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { activeBids, wonBids, lostBids, loading } = useAppSelector((state) => state.bid);
  const [selectedTab, setSelectedTab] = useState<BidTab>('active');
  const [showFireworks, setShowFireworks] = useState(false);
  const [showFireflies, setShowFireflies] = useState(false);

  useEffect(() => {
    loadBids();
  }, []);

  useEffect(() => {
    // Show fireworks when new win is detected
    if (wonBids.length > 0) {
      const latestWin = wonBids[0];
      const winTime = new Date(latestWin.endTime).getTime();
      const now = Date.now();

      // If win is recent (within 30 seconds), show celebration
      if (now - winTime < 30000) {
        setShowFireworks(true);
        setShowFireflies(true);

        // Auto-hide after 3 seconds
        setTimeout(() => {
          setShowFireworks(false);
        }, 3000);
        setTimeout(() => {
          setShowFireflies(false);
        }, 5000);
      }
    }
  }, [wonBids]);

  /**
   * Load bids from cache or API
   */
  const loadBids = async () => {
    try {
      // In production, fetch from API
      // For now, use mock data
      const mockActiveBids = generateMockActiveBids();
      const mockWonBids = generateMockWonBids();
      const mockLostBids = generateMockLostBids();

      dispatch(setActiveBids(mockActiveBids));
      dispatch(setWonBids(mockWonBids));
      dispatch(setLostBids(mockLostBids));

      // Cache for offline access
      await StorageHelpers.saveBids([]);
    } catch (error) {
      console.error('Failed to load bids:', error);
    }
  };

  /**
   * Navigate to lot details
   */
  const navigateToLot = (lot: AuctionLot) => {
    navigation.navigate('LotDetails', { lot });
  };

  /**
   * Get current tab data
   */
  const getCurrentTabData = (): AuctionLot[] => {
    switch (selectedTab) {
      case 'active':
        return activeBids;
      case 'won':
        return wonBids;
      case 'lost':
        return lostBids;
      default:
        return [];
    }
  };

  /**
   * Render tab button
   */
  const renderTab = (tab: BidTab, label: string, count: number) => {
    const isSelected = selectedTab === tab;

    return (
      <TouchableOpacity
        style={[styles.tab, isSelected && styles.tabSelected]}
        onPress={() => setSelectedTab(tab)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
          {label}
        </Text>
        <View
          style={[
            styles.countBadge,
            isSelected && styles.countBadgeSelected,
          ]}
        >
          <Text style={styles.countText}>{count}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={Gradients.lake} style={styles.header}>
        <Text style={styles.headerTitle}>MY BIDS</Text>
      </LinearGradient>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {renderTab('active', 'ACTIVE', activeBids.length)}
        {renderTab('won', 'WON', wonBids.length)}
        {renderTab('lost', 'LOST', lostBids.length)}
      </View>

      {/* Lot List */}
      <FlatList
        data={getCurrentTabData()}
        renderItem={({ item }) => (
          <LotCard
            lot={item}
            onPress={navigateToLot}
            showMaxBid={true}  // ALWAYS show max bid
            showFinalPrice={true}  // ALWAYS show final price
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedTab === 'active' && 'No active bids'}
              {selectedTab === 'won' && 'No wins yet'}
              {selectedTab === 'lost' && 'No lost bids'}
            </Text>
            <Text style={styles.emptySubtext}>
              Start bidding to see items here!
            </Text>
          </View>
        }
      />

      {/* Celebration Animations */}
      <FireworksAnimation
        visible={showFireworks}
        onComplete={() => setShowFireworks(false)}
      />
      <FireflyGlow visible={showFireflies} count={15} />
    </View>
  );
};

/**
 * Mock data generators
 */
const generateMockActiveBids = (): AuctionLot[] => [
  {
    id: 'lot-1',
    eventId: '1',
    title: 'Antique Walnut Dresser',
    description: 'Beautiful 1920s dresser in excellent condition',
    category: 'Furniture',
    images: [],
    startingBid: 50,
    currentBid: 125,
    maxBid: 150,  // User's max bid - ALWAYS SHOWN
    bidIncrement: 1,
    endTime: new Date(Date.now() + 3600000).toISOString(),
    status: 'active',
    totalBids: 8,
    hasARPreview: true,
  },
];

const generateMockWonBids = (): AuctionLot[] => [
  {
    id: 'lot-2',
    eventId: '1',
    title: 'Vintage Fishing Tackle Box',
    description: 'Complete with vintage lures',
    category: 'Sporting Goods',
    images: [],
    startingBid: 20,
    currentBid: 85,
    maxBid: 100,
    finalPrice: 85,  // Final winning price
    bidIncrement: 1,
    endTime: new Date(Date.now() - 1800000).toISOString(),
    status: 'won',
    totalBids: 12,
    hasARPreview: false,
  },
];

const generateMockLostBids = (): AuctionLot[] => [
  {
    id: 'lot-3',
    eventId: '1',
    title: 'Kentucky Lake Painting',
    description: 'Original oil painting by local artist',
    category: 'Art',
    images: [],
    startingBid: 100,
    currentBid: 250,
    maxBid: 200,  // User's max bid
    finalPrice: 250,  // CRITICAL: Final price shown even on lost bids
    bidIncrement: 1,
    endTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'lost',
    totalBids: 15,
    hasARPreview: false,
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
  headerTitle: {
    ...TextStyles.h1,
    color: KentuckyLakeTheme.white,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KentuckyLakeTheme.backgroundLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabSelected: {
    backgroundColor: KentuckyLakeTheme.lakeBlue,
  },
  tabText: {
    fontSize: 32,
    fontWeight: '700',
    color: KentuckyLakeTheme.damGray,
    marginRight: Spacing.xs,
  },
  tabTextSelected: {
    color: KentuckyLakeTheme.white,
  },
  countBadge: {
    backgroundColor: KentuckyLakeTheme.damGray,
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  countBadgeSelected: {
    backgroundColor: KentuckyLakeTheme.vibrantRed,
  },
  countText: {
    fontSize: 24,
    fontWeight: '700',
    color: KentuckyLakeTheme.white,
  },
  listContent: {
    paddingVertical: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...TextStyles.h2,
    color: KentuckyLakeTheme.damGray,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 36,
    color: KentuckyLakeTheme.damGray,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
