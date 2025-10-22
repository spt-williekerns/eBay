/**
 * Wave Animation Component (Lottie)
 *
 * Design Choices:
 * - Lottie for smooth, professional animations
 * - Wave animation represents Kentucky Lake
 * - Triggers on bid placement for visual feedback
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface WaveAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

/**
 * Wave Animation - Shown when user places a bid
 *
 * Note: In production, use an actual Lottie JSON file
 * For now, we'll use a placeholder that can be replaced
 */
export const WaveAnimation: React.FC<WaveAnimationProps> = ({ visible, onComplete }) => {
  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <LottieView
        source={require('../../assets/animations/wave.json')} // Placeholder
        autoPlay
        loop={false}
        onAnimationFinish={onComplete}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 998,
  },
  animation: {
    width: 300,
    height: 300,
  },
});

/**
 * Fallback Wave Animation (if Lottie file is missing)
 *
 * Simple wave effect using react-native-animatable
 */
import * as Animatable from 'react-native-animatable';
import { KentuckyLakeTheme } from '../../theme/colors';

export const FallbackWaveAnimation: React.FC<WaveAnimationProps> = ({
  visible,
  onComplete,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animatable.View
        animation={{
          0: {
            opacity: 0,
            scaleY: 0.1,
            translateY: 0,
          },
          0.5: {
            opacity: 1,
            scaleY: 1,
          },
          1: {
            opacity: 0,
            scaleY: 0.8,
            translateY: -100,
          },
        }}
        duration={1500}
        onAnimationEnd={onComplete}
        style={styles.wave}
      />
    </View>
  );
};

const waveStyles = StyleSheet.create({
  wave: {
    width: 200,
    height: 100,
    backgroundColor: KentuckyLakeTheme.waveTeal,
    borderRadius: 100,
    opacity: 0.6,
  },
});
