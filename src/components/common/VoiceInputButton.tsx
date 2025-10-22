/**
 * Voice Input Button Component
 *
 * Design Choices:
 * - Large microphone icon: Easy to see and tap
 * - Visual feedback: Pulsing animation when listening
 * - Natural language processing: "bid fifty dollars" etc.
 * - Accessibility: Critical for seniors with typing difficulty
 */

import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { voiceManager, VoiceCommand } from '../../utils/voice';
import { KentuckyLakeTheme } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { soundManager, Sounds } from '../../utils/sound';

interface VoiceInputButtonProps {
  onCommand: (command: VoiceCommand) => void;
  disabled?: boolean;
}

/**
 * Voice Input Button with Visual Feedback
 *
 * Shows pulsing animation when listening
 * Parses voice commands for bidding and navigation
 */
export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onCommand,
  disabled = false,
}) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isListening) {
        voiceManager.stopListening();
      }
    };
  }, [isListening]);

  const toggleListening = async () => {
    if (disabled) return;

    if (isListening) {
      // Stop listening
      await voiceManager.stopListening();
      setIsListening(false);
      soundManager.playSound(Sounds.BUTTON_TAP);
    } else {
      // Start listening
      await voiceManager.startListening();
      setIsListening(true);
      soundManager.playSound(Sounds.BUTTON_TAP);

      // Auto-stop after 5 seconds
      setTimeout(async () => {
        if (voiceManager.getIsListening()) {
          await voiceManager.stopListening();
          setIsListening(false);
        }
      }, 5000);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={toggleListening}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {isListening ? (
        <Animatable.View animation="pulse" iterationCount="infinite" duration={1000}>
          <View style={[styles.microphone, styles.microphoneActive]}>
            <Text style={styles.micIcon}>🎤</Text>
          </View>
        </Animatable.View>
      ) : (
        <View style={styles.microphone}>
          <Text style={styles.micIcon}>🎤</Text>
        </View>
      )}
      <Text style={styles.label}>{isListening ? 'LISTENING...' : 'VOICE'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  microphone: {
    width: Spacing.touchTarget.icon,
    height: Spacing.touchTarget.icon,
    borderRadius: Spacing.touchTarget.icon / 2,
    backgroundColor: KentuckyLakeTheme.lakeBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  microphoneActive: {
    backgroundColor: KentuckyLakeTheme.vibrantRed,
  },
  micIcon: {
    fontSize: 32,
  },
  label: {
    fontSize: 28,
    fontWeight: '700',
    color: KentuckyLakeTheme.textDark,
    marginTop: Spacing.xs,
  },
});
