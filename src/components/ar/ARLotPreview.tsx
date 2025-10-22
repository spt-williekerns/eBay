/**
 * AR Lot Preview Component
 *
 * Design Choices:
 * - Augmented Reality preview: See items in your space before bidding
 * - Uses ViroReact for AR functionality
 * - Magical experience: Enhances excitement and confidence
 * - Senior-friendly: Simple tap to activate
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { KentuckyLakeTheme } from '../../theme/colors';
import { TextStyles } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface ARLotPreviewProps {
  lotId: string;
  modelUrl?: string;
  onClose?: () => void;
}

/**
 * AR Preview Modal
 *
 * Note: Full AR implementation requires ViroReact setup
 * This is a placeholder showing the AR activation UI
 */
export const ARLotPreview: React.FC<ARLotPreviewProps> = ({
  lotId,
  modelUrl,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  const openAR = () => {
    setVisible(true);
  };

  const closeAR = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.activateButton} onPress={openAR}>
        <Text style={styles.activateText}>📱 VIEW IN YOUR SPACE</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" onRequestClose={closeAR}>
        <View style={styles.arContainer}>
          {/* AR View Placeholder */}
          <View style={styles.arViewport}>
            <Text style={styles.arInstructions}>
              Point your camera at a flat surface
            </Text>
            <Text style={styles.arSubtext}>
              The 3D model will appear in your space
            </Text>

            {/* In production, ViroARSceneNavigator would go here */}
            {/* Example:
            <ViroARSceneNavigator
              initialScene={{
                scene: ARScene,
              }}
            />
            */}
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeAR}>
            <Text style={styles.closeText}>CLOSE AR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  activateButton: {
    backgroundColor: KentuckyLakeTheme.waveTeal,
    height: Spacing.touchTarget.button,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  activateText: {
    ...TextStyles.button,
    color: KentuckyLakeTheme.white,
  },
  arContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  arViewport: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arInstructions: {
    ...TextStyles.h1,
    color: KentuckyLakeTheme.white,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  arSubtext: {
    ...TextStyles.body,
    color: KentuckyLakeTheme.cream,
    textAlign: 'center',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    backgroundColor: KentuckyLakeTheme.vibrantRed,
    height: Spacing.touchTarget.button,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Spacing.lg,
    borderRadius: 16,
  },
  closeText: {
    ...TextStyles.button,
    color: KentuckyLakeTheme.white,
  },
});
