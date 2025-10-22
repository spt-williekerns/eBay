/**
 * Countdown Timer Component
 *
 * Design Choices:
 * - LOUD audio alerts: Critical for time-sensitive bidding
 * - Color changes: Visual urgency indicators
 * - Large display: 56pt font for immediate visibility
 * - Banjo sounds: Kentucky theme + attention-grabbing
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KentuckyLakeTheme } from '../../theme/colors';
import { TextStyles } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { formatTimeRemaining } from '../../utils/formatters';
import { soundManager, Sounds } from '../../utils/sound';

interface CountdownTimerProps {
  endTime: string;
  onExpire?: () => void;
  soundEnabled?: boolean;
}

/**
 * Countdown Timer with Audio Alerts
 *
 * Audio alerts:
 * - 30 seconds: Warning sound
 * - 10 seconds: Urgent buzzer (repeating)
 * - 0 seconds: Ended sound
 */
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onExpire,
  soundEnabled = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'warning' | 'urgent' | 'ended'>('normal');
  const timerRef = useRef<Animatable.View & View>(null);
  const warningPlayedRef = useRef(false);
  const urgentPlayedRef = useRef(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining('ENDED');
        setUrgency('ended');

        if (soundEnabled) {
          soundManager.playSound(Sounds.TIMER_ENDED, 1.0);
        }

        if (onExpire) {
          onExpire();
        }

        return;
      }

      const seconds = Math.floor(diff / 1000);

      // Update display
      setTimeRemaining(formatTimeRemaining(endTime));

      // Audio alerts based on time remaining
      if (seconds <= 10 && urgency !== 'urgent') {
        setUrgency('urgent');
        if (soundEnabled && !urgentPlayedRef.current) {
          soundManager.playSound(Sounds.TIMER_URGENT, 1.0);
          urgentPlayedRef.current = true;
        }
        // Shake animation
        timerRef.current?.shake?.(800);
      } else if (seconds <= 30 && urgency !== 'warning' && urgency !== 'urgent') {
        setUrgency('warning');
        if (soundEnabled && !warningPlayedRef.current) {
          soundManager.playSound(Sounds.TIMER_WARNING, 0.8);
          warningPlayedRef.current = true;
        }
        // Pulse animation
        timerRef.current?.pulse?.(1000);
      } else if (seconds > 30) {
        setUrgency('normal');
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire, soundEnabled, urgency]);

  const getTimerColor = () => {
    switch (urgency) {
      case 'urgent':
        return KentuckyLakeTheme.error;
      case 'warning':
        return KentuckyLakeTheme.warning;
      case 'ended':
        return KentuckyLakeTheme.damGray;
      default:
        return KentuckyLakeTheme.lakeBlue;
    }
  };

  return (
    <Animatable.View
      ref={timerRef}
      style={[styles.container, { backgroundColor: getTimerColor() }]}
    >
      <Text style={styles.label}>TIME LEFT</Text>
      <Text style={styles.timer}>{timeRemaining}</Text>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 36,
    fontWeight: '700',
    color: KentuckyLakeTheme.white,
    marginBottom: Spacing.xs,
  },
  timer: {
    ...TextStyles.timer,
    color: KentuckyLakeTheme.white,
  },
});
