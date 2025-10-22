/**
 * Home Screen - Event List by Location
 *
 * Design Choices:
 * - Location-based filtering: Easy to find nearby auctions
 * - Large event cards: Easy to see and tap
 * - No auto-refresh: Prevents disorienting screen changes
 * - Pull-to-refresh: Manual control for seniors
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { setEvents, setLoading } from '../store/slices/auctionSlice';
import { AuctionEvent } from '../types';
import { KentuckyLakeTheme } from '../theme/colors';
import { TextStyles } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { formatDate } from '../utils/formatters';
import { VoiceInputButton } from '../components/common/VoiceInputButton';
import { voiceManager } from '../utils/voice';
import { StorageHelpers } from '../utils/storage';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../theme/colors';

/**
 * Home Screen Component
 *
 * Shows list of auction events filtered by location
 */
export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.auction);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  /**
   * Load events from cache or API
   */
  const loadEvents = async () => {
    try {
      dispatch(setLoading(true));

      // Try to load from cache first (offline support)
      const cached = await StorageHelpers.loadEvents();

      if (cached && cached.length > 0) {
        dispatch(setEvents(cached));
      } else {
        // In production, fetch from API
        const mockEvents = generateMockEvents();
        dispatch(setEvents(mockEvents));
        await StorageHelpers.saveEvents(mockEvents);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Manual refresh (pull-to-refresh)
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  /**
   * Handle voice commands
   */
  const handleVoiceCommand = (command: any) => {
    if (command.type === 'navigate') {
      navigation.navigate(command.screen);
    } else if (command.type === 'search') {
      // Implement search functionality
      console.log('Search:', command.query);
    }
  };

  /**
   * Navigate to event details
   */
  const navigateToEvent = (event: AuctionEvent) => {
    navigation.navigate('EventDetails', { event });
  };

  /**
   * Render event card
   */
  const renderEventCard = ({ item }: { item: AuctionEvent }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigateToEvent(item)}
      activeOpacity={0.8}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl } as ImageSourcePropType}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}

      <LinearGradient
        colors={Gradients.wood}
        style={styles.eventContent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Date:</Text>
          <Text style={styles.dateText}>{formatDate(item.startDate)}</Text>
        </View>

        <View style={styles.lotsRow}>
          <Text style={styles.lotsText}>
            {item.activeLots} / {item.totalLots} Lots Active
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Voice Button */}
      <LinearGradient colors={Gradients.lake} style={styles.header}>
        <Text style={styles.headerTitle}>AUCTIONS NEAR YOU</Text>
        <VoiceInputButton onCommand={handleVoiceCommand} />
      </LinearGradient>

      {/* Event List */}
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={KentuckyLakeTheme.lakeBlue}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No auctions available</Text>
            <Text style={styles.emptySubtext}>Pull down to refresh</Text>
          </View>
        }
      />
    </View>
  );
};

/**
 * Generate mock events for demonstration
 * In production, this would come from an API
 */
const generateMockEvents = (): AuctionEvent[] => [
  {
    id: '1',
    title: 'Marshall County Estate Auction',
    location: 'Benton, KY',
    address: '123 Main St, Benton, KY 42025',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 172800000).toISOString(),
    totalLots: 150,
    activeLots: 120,
    description: 'Large estate auction featuring antiques, furniture, and collectibles',
  },
  {
    id: '2',
    title: 'Kentucky Lake Boat & Equipment Auction',
    location: 'Gilbertsville, KY',
    address: '456 Lake Dr, Gilbertsville, KY 42044',
    startDate: new Date(Date.now() + 259200000).toISOString(),
    endDate: new Date(Date.now() + 345600000).toISOString(),
    totalLots: 75,
    activeLots: 65,
    description: 'Boats, motors, and lake equipment',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...TextStyles.h1,
    color: KentuckyLakeTheme.white,
    flex: 1,
  },
  listContent: {
    paddingVertical: Spacing.md,
  },
  eventCard: {
    marginHorizontal: Spacing.screen.horizontal,
    marginVertical: Spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventContent: {
    padding: Spacing.md,
  },
  eventTitle: {
    ...TextStyles.h2,
    color: KentuckyLakeTheme.white,
    marginBottom: Spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  locationIcon: {
    fontSize: 32,
    marginRight: Spacing.xs,
  },
  locationText: {
    fontSize: 38,
    fontWeight: '600',
    color: KentuckyLakeTheme.cream,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  dateLabel: {
    fontSize: 36,
    fontWeight: '500',
    color: KentuckyLakeTheme.lightOak,
    marginRight: Spacing.sm,
  },
  dateText: {
    fontSize: 38,
    fontWeight: '700',
    color: KentuckyLakeTheme.white,
  },
  lotsRow: {
    marginTop: Spacing.sm,
  },
  lotsText: {
    fontSize: 34,
    fontWeight: '600',
    color: KentuckyLakeTheme.fireflyGold,
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
  },
  emptySubtext: {
    fontSize: 36,
    color: KentuckyLakeTheme.damGray,
    marginTop: Spacing.md,
  },
});
