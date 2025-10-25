/**
 * Web-Compatible Sound Manager
 *
 * Uses HTML5 Audio instead of react-native-sound
 */

class WebSoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled = true;

  loadSound(name: string, filename: string): void {
    try {
      const audio = new Audio(`/sounds/${filename}`);
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    } catch (error) {
      console.error(`Failed to load sound ${name}:`, error);
    }
  }

  playSound(name: string, volume: number = 1.0): void {
    if (!this.enabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0; // Reset to start
      sound.play().catch(error => {
        console.error(`Failed to play sound ${name}:`, error);
      });
    }
  }

  stopSound(name: string): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  releaseAll(): void {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.src = ''; // Release resource
    });
    this.sounds.clear();
  }
}

export const soundManager = new WebSoundManager();

export const Sounds = {
  BID_PLACED: 'bid_placed',
  BID_WON: 'bid_won',
  BID_LOST: 'bid_lost',
  TIMER_WARNING: 'timer_warning',
  TIMER_URGENT: 'timer_urgent',
  TIMER_ENDED: 'timer_ended',
  BUTTON_TAP: 'button_tap',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const initializeSounds = (): void => {
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
