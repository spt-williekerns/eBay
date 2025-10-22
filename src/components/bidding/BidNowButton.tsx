/**
 * BID NOW Button Component
 *
 * Design Choices:
 * - ONE-TAP bidding: Simplest possible interaction for seniors
 * - $1 increments: Easy to understand, no complex math
 * - HUGE button: 80px height, impossible to miss
 * - High contrast red/white: Maximum visibility
 * - Haptic feedback: Physical confirmation of tap
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { KentuckyLakeTheme } from '../../theme/colors';
import { TextStyles } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import { soundManager, Sounds } from '../../utils/sound';

interface BidNowButtonProps {
  currentBid: number;
  increment?: number;
  onBid: (amount: number) => Promise<void>;
  disabled?: boolean;
}

/**
 * One-Tap BID NOW Button
 *
 * Automatically bids current amount + $1 (or custom increment)
 * No confirmation needed - designed for speed and simplicity
 */
export const BidNowButton: React.FC<BidNowButtonProps> = ({
  currentBid,
  increment = 1,
  onBid,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const nextBid = currentBid + increment;

  const handleBid = async () => {
    if (disabled || loading) return;

    try {
      setLoading(true);

      // Haptic feedback (vibration)
      Vibration.vibrate(50);

      // Sound feedback
      soundManager.playSound(Sounds.BID_PLACED);

      // Place bid
      await onBid(nextBid);
    } catch (error) {
      console.error('Bid failed:', error);
      soundManager.playSound(Sounds.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handleBid}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="large" color={KentuckyLakeTheme.white} />
      ) : (
        <>
          <Text style={styles.buttonText}>BID NOW</Text>
          <Text style={styles.amountText}>{formatCurrency(nextBid)}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: Spacing.touchTarget.button,
    backgroundColor: KentuckyLakeTheme.vibrantRed,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: KentuckyLakeTheme.damGray,
    opacity: 0.5,
  },
  buttonText: {
    ...TextStyles.button,
    color: KentuckyLakeTheme.white,
    fontSize: 44, // Extra large for visibility
  },
  amountText: {
    ...TextStyles.price,
    color: KentuckyLakeTheme.white,
    fontSize: 48,
    marginTop: 4,
  },
});
