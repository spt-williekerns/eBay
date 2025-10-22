/**
 * Firefly Glow Animation
 *
 * Design Choices:
 * - Magical firefly effect for winning bids
 * - Gentle pulsing glow (Kentucky summer nights theme)
 * - Multiple fireflies for visual interest
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KentuckyLakeTheme } from '../../theme/colors';

interface FireflyGlowProps {
  visible: boolean;
  count?: number;
}

/**
 * Single firefly with random position and animation
 */
const Firefly: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => {
  return (
    <Animatable.View
      animation="pulse"
      iterationCount="infinite"
      duration={2000}
      delay={delay}
      style={[styles.firefly, { left: `${x}%`, top: `${y}%` }]}
    >
      <View style={styles.glowOuter}>
        <View style={styles.glowInner} />
      </View>
    </Animatable.View>
  );
};

/**
 * Firefly Glow Effect - Shown on winning bids
 */
export const FireflyGlow: React.FC<FireflyGlowProps> = ({ visible, count = 10 }) => {
  if (!visible) return null;

  const fireflies = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 1000,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {fireflies.map((ff) => (
        <Firefly key={ff.id} delay={ff.delay} x={ff.x} y={ff.y} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  firefly: {
    position: 'absolute',
  },
  glowOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: KentuckyLakeTheme.fireflyGold,
    opacity: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: KentuckyLakeTheme.fireflyGold,
    opacity: 0.9,
  },
});
