/**
 * Offline Storage Utility using AsyncStorage
 *
 * Design Choices:
 * - AsyncStorage for offline caching: Ensures app works without internet
 * - Automatic cache invalidation: Prevents stale data (24-hour expiry)
 * - Type-safe storage: Prevents data corruption
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuctionEvent, AuctionLot, User, Bid, WatchlistItem } from '../types';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Generic storage wrapper with caching
 */
class StorageManager {
  /**
   * Save data to AsyncStorage with timestamp
   */
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const cached: CachedData<T> = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cached));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }

  /**
   * Load data from AsyncStorage with cache validation
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const parsed: CachedData<T> = JSON.parse(cached);

      // Check if cache is still valid
      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
      if (isExpired) {
        await this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  /**
   * Clear all cached data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

// Singleton instance
export const storage = new StorageManager();

// Typed storage keys
export const StorageKeys = {
  USER: 'user',
  EVENTS: 'events',
  LOTS: 'lots',
  BIDS: 'bids',
  WATCHLIST: 'watchlist',
  SETTINGS: 'settings',
};

/**
 * Convenience functions for common data types
 */
export const StorageHelpers = {
  // User
  saveUser: (user: User) => storage.save(StorageKeys.USER, user),
  loadUser: () => storage.load<User>(StorageKeys.USER),

  // Events
  saveEvents: (events: AuctionEvent[]) => storage.save(StorageKeys.EVENTS, events),
  loadEvents: () => storage.load<AuctionEvent[]>(StorageKeys.EVENTS),

  // Lots
  saveLots: (lots: AuctionLot[]) => storage.save(StorageKeys.LOTS, lots),
  loadLots: () => storage.load<AuctionLot[]>(StorageKeys.LOTS),

  // Bids
  saveBids: (bids: Bid[]) => storage.save(StorageKeys.BIDS, bids),
  loadBids: () => storage.load<Bid[]>(StorageKeys.BIDS),

  // Watchlist
  saveWatchlist: (items: WatchlistItem[]) => storage.save(StorageKeys.WATCHLIST, items),
  loadWatchlist: () => storage.load<WatchlistItem[]>(StorageKeys.WATCHLIST),
};
