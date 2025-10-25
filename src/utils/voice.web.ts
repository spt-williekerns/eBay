/**
 * Web-Compatible Voice Input
 *
 * Uses browser's Web Speech API instead of react-native-voice
 */

export type VoiceCommand =
  | { type: 'bid'; amount: number }
  | { type: 'navigate'; screen: string }
  | { type: 'search'; query: string }
  | { type: 'unknown' };

class WebVoiceManager {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice transcript:', transcript);
        // Handle result
      };

      this.recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    } else {
      console.warn('Web Speech API not supported in this browser');
    }
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.isListening = false;
    }
  }

  async stopListening(): Promise<void> {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

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
      if (lower.includes('home')) return { type: 'navigate', screen: 'Home' };
      if (lower.includes('bid')) return { type: 'navigate', screen: 'Bids' };
      if (lower.includes('watch')) return { type: 'navigate', screen: 'Watchlist' };
      if (lower.includes('profile')) return { type: 'navigate', screen: 'Profile' };
      if (lower.includes('leaderboard')) return { type: 'navigate', screen: 'Leaderboard' };
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

  private extractNumber(text: string): number | null {
    const numberWords: { [key: string]: number } = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
      'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
      'ten': 10, 'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
      'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
      'hundred': 100, 'thousand': 1000,
    };

    // Try digit
    const digitMatch = text.match(/\d+/);
    if (digitMatch) {
      return parseInt(digitMatch[0], 10);
    }

    // Try word
    for (const [word, value] of Object.entries(numberWords)) {
      if (text.includes(word)) {
        return value;
      }
    }

    return null;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  async destroy(): Promise<void> {
    if (this.recognition) {
      this.recognition.abort();
    }
  }
}

export const voiceManager = new WebVoiceManager();
