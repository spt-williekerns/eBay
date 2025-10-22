/**
 * Sound Manager for Audio Feedback
 *
 * Design Choices:
 * - Loud sounds for excitement: Enhances thrill of bidding
 * - Banjo sounds: Kentucky theme (local culture)
 * - Audio alerts: Important for seniors who may have visual impairment
 */

import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

class SoundManager {
  private sounds: Map<string, Sound> = new Map();
  private enabled = true;

  /**
   * Load sound file
   */
  loadSound(name: string, filename: string): void {
    const sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error(`Failed to load sound ${name}:`, error);
        return;
      }
    });

    this.sounds.set(name, sound);
  }

  /**
   * Play sound by name
   */
  playSound(name: string, volume: number = 1.0): void {
    if (!this.enabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      sound.setVolume(volume);
      sound.play((success) => {
        if (!success) {
          console.error(`Failed to play sound ${name}`);
        }
      });
    }
  }

  /**
   * Stop sound
   */
  stopSound(name: string): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.stop();
    }
  }

  /**
   * Enable/disable all sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Release all sounds (cleanup)
   */
  releaseAll(): void {
    this.sounds.forEach((sound) => {
      sound.release();
    });
    this.sounds.clear();
  }
}

// Singleton instance
export const soundManager = new SoundManager();

/**
 * Pre-defined sound effects for the app
 */
export const Sounds = {
  // Bidding sounds
  BID_PLACED: 'bid_placed',          // Quick banjo strum
  BID_WON: 'bid_won',                // Triumphant banjo melody
  BID_LOST: 'bid_lost',              // Sad trombone

  // Timer sounds
  TIMER_WARNING: 'timer_warning',    // Banjo warning (30 seconds left)
  TIMER_URGENT: 'timer_urgent',      // Loud buzzer (10 seconds left)
  TIMER_ENDED: 'timer_ended',        // Air horn

  // UI sounds
  BUTTON_TAP: 'button_tap',          // Subtle click
  SUCCESS: 'success',                // Positive chime
  ERROR: 'error',                    // Error beep
};

/**
 * Initialize all sounds on app start
 */
export const initializeSounds = (): void => {
  // Note: In production, these would be actual sound files
  // For demo purposes, we're just registering the names
  soundManager.loadSound(Sounds.BID_PLACED, 'bid_placed.mp3');
  soundManager.loadSound(Sounds.BID_WON, 'bid_won.mp3');
  soundManager.loadSound(Sounds.BID_LOST, 'bid_lost.mp3');
  soundManager.loadSound(Sounds.TIMER_WARNING, 'timer_warning.mp3');
  soundManager.loadSound(Sounds.TIMER_URGENT, 'timer_urgent.mp3');
  soundManager.loadSound(Sounds.TIMER_ENDED, 'timer_ended.mp3');
  soundManager.loadSound(Sounds.BUTTON_TAP, 'button_tap.mp3');
  soundManager.loadSound(Sounds.SUCCESS, 'success.mp3');
  soundManager.loadSound(Sounds.ERROR, 'error.mp3');
};
