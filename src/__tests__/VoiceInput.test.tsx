/**
 * Voice Input Tests
 *
 * Tests voice command parsing and functionality
 */

import { voiceManager } from '../utils/voice';

describe('Voice Command Parsing', () => {
  it('parses bid commands correctly', () => {
    const command = voiceManager.parseCommand('bid fifty dollars');
    expect(command.type).toBe('bid');
    if (command.type === 'bid') {
      expect(command.amount).toBe(50);
    }
  });

  it('parses navigation commands correctly', () => {
    const command = voiceManager.parseCommand('go to watchlist');
    expect(command.type).toBe('navigate');
    if (command.type === 'navigate') {
      expect(command.screen).toBe('Watchlist');
    }
  });

  it('parses search commands correctly', () => {
    const command = voiceManager.parseCommand('search antique furniture');
    expect(command.type).toBe('search');
    if (command.type === 'search') {
      expect(command.query).toBe('antique furniture');
    }
  });

  it('handles numeric bid amounts', () => {
    const command = voiceManager.parseCommand('bid 100 dollars');
    expect(command.type).toBe('bid');
    if (command.type === 'bid') {
      expect(command.amount).toBe(100);
    }
  });

  it('returns unknown for invalid commands', () => {
    const command = voiceManager.parseCommand('hello world');
    expect(command.type).toBe('unknown');
  });
});
