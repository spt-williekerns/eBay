/**
 * Voice Input Utility using Web Speech API
 *
 * Design Choices:
 * - Voice input for accessibility: Seniors may have difficulty typing
 * - Command parsing: Natural language commands (e.g., "bid fifty dollars")
 * - Error handling: Graceful fallback to manual input
 */

import Voice, { SpeechResultsEvent, SpeechErrorEvent } from 'react-native-voice';

export type VoiceCommand =
  | { type: 'bid'; amount: number }
  | { type: 'navigate'; screen: string }
  | { type: 'search'; query: string }
  | { type: 'unknown' };

class VoiceManager {
  private isListening = false;

  constructor() {
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  /**
   * Start listening for voice input
   */
  async startListening(): Promise<void> {
    try {
      this.isListening = true;
      await Voice.start('en-US');
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.isListening = false;
    }
  }

  /**
   * Stop listening for voice input
   */
  async stopListening(): Promise<void> {
    try {
      this.isListening = false;
      await Voice.stop();
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
    }
  }

  /**
   * Handle speech results
   */
  private onSpeechResults(event: SpeechResultsEvent) {
    if (event.value && event.value.length > 0) {
      const transcript = event.value[0].toLowerCase();
      console.log('Voice transcript:', transcript);
    }
  }

  /**
   * Handle speech errors
   */
  private onSpeechError(event: SpeechErrorEvent) {
    console.error('Voice recognition error:', event.error);
    this.isListening = false;
  }

  /**
   * Parse voice command from transcript
   *
   * Examples:
   * - "bid fifty dollars" -> { type: 'bid', amount: 50 }
   * - "go to watchlist" -> { type: 'navigate', screen: 'Watchlist' }
   * - "search antique furniture" -> { type: 'search', query: 'antique furniture' }
   */
  parseCommand(transcript: string): VoiceCommand {
    const lower = transcript.toLowerCase().trim();

    // Bid commands
    if (lower.includes('bid')) {
      const amount = this.extractNumber(lower);
      if (amount !== null) {
        return { type: 'bid', amount };
      }
    }

    // Navigation commands
    if (lower.includes('go to') || lower.includes('show')) {
      if (lower.includes('home')) {
        return { type: 'navigate', screen: 'Home' };
      }
      if (lower.includes('bid')) {
        return { type: 'navigate', screen: 'Bids' };
      }
      if (lower.includes('watch')) {
        return { type: 'navigate', screen: 'Watchlist' };
      }
      if (lower.includes('profile')) {
        return { type: 'navigate', screen: 'Profile' };
      }
      if (lower.includes('leaderboard')) {
        return { type: 'navigate', screen: 'Leaderboard' };
      }
    }

    // Search commands
    if (lower.includes('search') || lower.includes('find')) {
      const query = lower.replace(/search|find/g, '').trim();
      if (query) {
        return { type: 'search', query };
      }
    }

    return { type: 'unknown' };
  }

  /**
   * Extract number from text (supports words and digits)
   */
  private extractNumber(text: string): number | null {
    const numberWords: { [key: string]: number } = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
      'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
      'ten': 10, 'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
      'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
      'hundred': 100, 'thousand': 1000,
    };

    // Try to find digit
    const digitMatch = text.match(/\d+/);
    if (digitMatch) {
      return parseInt(digitMatch[0], 10);
    }

    // Try to find word
    for (const [word, value] of Object.entries(numberWords)) {
      if (text.includes(word)) {
        return value;
      }
    }

    return null;
  }

  /**
   * Check if voice is currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Destroy voice manager (cleanup)
   */
  async destroy(): Promise<void> {
    try {
      await Voice.destroy();
    } catch (error) {
      console.error('Failed to destroy voice:', error);
    }
  }
}

// Singleton instance
export const voiceManager = new VoiceManager();
