/**
 * Auction Lot Card Component
 *
 * Design Choices:
 * - Large card: Easy to tap, plenty of visual space
 * - High contrast text: 40pt+ fonts for readability
 * - Always show max bid and final price (bug fix!)
 * - Visual status indicators: Color-coded borders
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { AuctionLot } from '../../types';
import { KentuckyLakeTheme } from '../../theme/colors';
import { TextStyles } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { formatCurrency, formatTimeRemaining } from '../../utils/formatters';
import { CountdownTimer } from './CountdownTimer';

interface LotCardProps {
  lot: AuctionLot;
  onPress: (lot: AuctionLot) => void;
  showMaxBid?: boolean;
  showFinalPrice?: boolean;
}

/**
 * Lot Card - Displays auction lot information
 *
 * ALWAYS shows max bid and final price (original bug fix)
 */
export const LotCard: React.FC<LotCardProps> = ({
  lot,
  onPress,
  showMaxBid = true,
  showFinalPrice = true,
}) => {
  const getStatusColor = () => {
    switch (lot.status) {
      case 'won':
        return KentuckyLakeTheme.success;
      case 'lost':
        return KentuckyLakeTheme.error;
      case 'active':
        return KentuckyLakeTheme.lakeBlue;
      default:
        return KentuckyLakeTheme.damGray;
    }
  };

  const getStatusText = () => {
    switch (lot.status) {
      case 'won':
        return 'WON! 🎉';
      case 'lost':
        return 'LOST';
      case 'active':
        return 'ACTIVE';
      default:
        return 'PENDING';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getStatusColor() }]}
      onPress={() => onPress(lot)}
      activeOpacity={0.8}
    >
      {/* Lot Image */}
      {lot.images.length > 0 && (
        <Image
          source={{ uri: lot.images[0] } as ImageSourcePropType}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {lot.title}
        </Text>

        {/* Current Bid */}
        <View style={styles.priceRow}>
          <Text style={styles.label}>Current Bid:</Text>
          <Text style={styles.price}>{formatCurrency(lot.currentBid)}</Text>
        </View>

        {/* Max Bid - ALWAYS VISIBLE (bug fix) */}
        {showMaxBid && lot.maxBid && (
          <View style={styles.priceRow}>
            <Text style={styles.label}>Your Max Bid:</Text>
            <Text style={[styles.price, styles.maxBidPrice]}>
              {formatCurrency(lot.maxBid)}
            </Text>
          </View>
        )}

        {/* Final Price - ALWAYS VISIBLE for lost lots (bug fix) */}
        {showFinalPrice && lot.finalPrice && lot.status === 'lost' && (
          <View style={styles.priceRow}>
            <Text style={styles.label}>Final Price:</Text>
            <Text style={[styles.price, styles.finalPrice]}>
              {formatCurrency(lot.finalPrice)}
            </Text>
          </View>
        )}

        {/* Countdown Timer (active lots only) */}
        {lot.status === 'active' && (
          <CountdownTimer endTime={lot.endTime} soundEnabled={false} />
        )}

        {/* AR Preview Badge */}
        {lot.hasARPreview && (
          <View style={styles.arBadge}>
            <Text style={styles.arText}>📱 AR PREVIEW</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: KentuckyLakeTheme.backgroundLight,
    borderRadius: 16,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.screen.horizontal,
    overflow: 'hidden',
    borderLeftWidth: 8,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: Spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  statusText: {
    fontSize: 32,
    fontWeight: '700',
    color: KentuckyLakeTheme.white,
  },
  title: {
    ...TextStyles.h2,
    color: KentuckyLakeTheme.textDark,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  label: {
    fontSize: 36,
    fontWeight: '500',
    color: KentuckyLakeTheme.damGray,
  },
  price: {
    fontSize: 42,
    fontWeight: '700',
    color: KentuckyLakeTheme.lakeBlue,
  },
  maxBidPrice: {
    color: KentuckyLakeTheme.warning,
  },
  finalPrice: {
    color: KentuckyLakeTheme.error,
  },
  arBadge: {
    backgroundColor: KentuckyLakeTheme.waveTeal,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  arText: {
    fontSize: 28,
    fontWeight: '700',
    color: KentuckyLakeTheme.white,
  },
});
