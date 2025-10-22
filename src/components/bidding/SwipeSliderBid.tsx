/**
 * Swipe Slider Bidding Component
 *
 * Design Choices:
 * - Alternative to one-tap for custom amounts
 * - Large slider: Easy to manipulate for seniors
 * - Confirmation popup: Prevents accidental bids
 * - Real-time preview: Shows exact bid amount
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { KentuckyLakeTheme } from '../../theme/colors';
import { TextStyles } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import { soundManager, Sounds } from '../../utils/sound';

interface SwipeSliderBidProps {
  currentBid: number;
  maxBid?: number;
  onBid: (amount: number) => Promise<void>;
}

/**
 * Swipe Slider with Confirmation Popup
 *
 * Allows users to set custom bid amounts with confirmation
 */
export const SwipeSliderBid: React.FC<SwipeSliderBidProps> = ({
  currentBid,
  maxBid = currentBid + 100,
  onBid,
}) => {
  const [sliderValue, setSliderValue] = useState(currentBid + 1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSliderChange = (value: number) => {
    setSliderValue(Math.round(value));
    // Subtle vibration on value change
    Vibration.vibrate(10);
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
    soundManager.playSound(Sounds.BUTTON_TAP);
  };

  const confirmBid = async () => {
    try {
      setShowConfirmation(false);
      Vibration.vibrate(50);
      soundManager.playSound(Sounds.BID_PLACED);
      await onBid(sliderValue);
    } catch (error) {
      console.error('Bid failed:', error);
      soundManager.playSound(Sounds.ERROR);
    }
  };

  const cancelBid = () => {
    setShowConfirmation(false);
    soundManager.playSound(Sounds.BUTTON_TAP);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Bid Amount:</Text>

      <Text style={styles.amount}>{formatCurrency(sliderValue)}</Text>

      {/* Large slider for easy manipulation */}
      <Slider
        style={styles.slider}
        minimumValue={currentBid + 1}
        maximumValue={maxBid}
        value={sliderValue}
        onValueChange={handleSliderChange}
        minimumTrackTintColor={KentuckyLakeTheme.lakeBlue}
        maximumTrackTintColor={KentuckyLakeTheme.damGray}
        thumbTintColor={KentuckyLakeTheme.vibrantRed}
        step={1}
      />

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>{formatCurrency(currentBid + 1)}</Text>
        <Text style={styles.rangeText}>{formatCurrency(maxBid)}</Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>SUBMIT BID</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
        onRequestClose={cancelBid}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Bid</Text>
            <Text style={styles.modalAmount}>{formatCurrency(sliderValue)}</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to place this bid?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelBid}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmBid}
              >
                <Text style={styles.confirmButtonText}>CONFIRM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: KentuckyLakeTheme.backgroundLight,
    borderRadius: 16,
    padding: Spacing.md,
    marginVertical: Spacing.md,
  },
  label: {
    ...TextStyles.body,
    color: KentuckyLakeTheme.textDark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  amount: {
    ...TextStyles.price,
    color: KentuckyLakeTheme.vibrantRed,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slider: {
    width: '100%',
    height: 60, // Extra tall for easy grabbing
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  rangeText: {
    fontSize: 36,
    color: KentuckyLakeTheme.damGray,
  },
  submitButton: {
    backgroundColor: KentuckyLakeTheme.lakeBlue,
    height: Spacing.touchTarget.button,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitText: {
    ...TextStyles.button,
    color: KentuckyLakeTheme.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: KentuckyLakeTheme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: KentuckyLakeTheme.white,
    borderRadius: 24,
    padding: Spacing.xl,
    width: '85%',
    maxWidth: 500,
  },
  modalTitle: {
    ...TextStyles.h2,
    color: KentuckyLakeTheme.textDark,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalAmount: {
    ...TextStyles.price,
    color: KentuckyLakeTheme.vibrantRed,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalMessage: {
    ...TextStyles.body,
    color: KentuckyLakeTheme.textDark,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    height: Spacing.touchTarget.button,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  cancelButton: {
    backgroundColor: KentuckyLakeTheme.damGray,
  },
  confirmButton: {
    backgroundColor: KentuckyLakeTheme.vibrantRed,
  },
  cancelButtonText: {
    ...TextStyles.button,
    color: KentuckyLakeTheme.white,
  },
  confirmButtonText: {
    ...TextStyles.button,
    color: KentuckyLakeTheme.white,
  },
});
