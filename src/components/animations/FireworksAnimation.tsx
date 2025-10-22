/**
 * Fireworks Animation Component
 *
 * Design Choices:
 * - react-native-animatable for smooth animations
 * - Triggers on auction wins for excitement
 * - Large, colorful display for senior visibility
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KentuckyLakeTheme } from '../../theme/colors';

interface FireworksAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

/**
 * Individual firework particle
 */
const Firework: React.FC<{ delay: number; color: string; x: number; y: number }> = ({
  delay,
  color,
  x,
  y,
}) => {
  return (
    <Animatable.View
      animation={{
        0: {
          opacity: 0,
          scale: 0,
          translateX: 0,
          translateY: 0,
        },
        0.3: {
          opacity: 1,
          scale: 1.5,
        },
        1: {
          opacity: 0,
          scale: 0.5,
          translateX: x,
          translateY: y,
        },
      }}
      duration={1500}
      delay={delay}
      style={[styles.firework, { backgroundColor: color }]}
    />
  );
};

/**
 * Fireworks Animation - Shown when user wins a bid
 */
export const FireworksAnimation: React.FC<FireworksAnimationProps> = ({
  visible,
  onComplete,
}) => {
  useEffect(() => {
    if (visible && onComplete) {
      // Auto-hide after 3 seconds
      const timeout = setTimeout(onComplete, 3000);
      return () => clearTimeout(timeout);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  // Generate random firework positions
  const fireworks = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1000,
    color: [
      KentuckyLakeTheme.vibrantRed,
      KentuckyLakeTheme.fireflyGold,
      KentuckyLakeTheme.skyBlue,
      KentuckyLakeTheme.lakeGreen,
    ][i % 4],
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.5) * 400,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {fireworks.map((fw) => (
        <Firework
          key={fw.id}
          delay={fw.delay}
          color={fw.color}
          x={fw.x}
          y={fw.y}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  firework: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
