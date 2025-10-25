/**
 * Web-Compatible Storage
 *
 * Uses localStorage instead of AsyncStorage
 */

import { AuctionEvent, AuctionLot, User, Bid, WatchlistItem } from '../types';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData<T> {
  data: T;
  timestamp: number;
}

class WebStorageManager {
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const cached: CachedData<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cached));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }

  async load<T>(key: string): Promise<T | null> {
    try {
      const cached = localStorage.getItem(key);
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

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export const storage = new WebStorageManager();

export const StorageKeys = {
  USER: 'user',
  EVENTS: 'events',
  LOTS: 'lots',
  BIDS: 'bids',
  WATCHLIST: 'watchlist',
  SETTINGS: 'settings',
};

export const StorageHelpers = {
  saveUser: (user: User) => storage.save(StorageKeys.USER, user),
  loadUser: () => storage.load<User>(StorageKeys.USER),
  saveEvents: (events: AuctionEvent[]) => storage.save(StorageKeys.EVENTS, events),
  loadEvents: () => storage.load<AuctionEvent[]>(StorageKeys.EVENTS),
  saveLots: (lots: AuctionLot[]) => storage.save(StorageKeys.LOTS, lots),
  loadLots: () => storage.load<AuctionLot[]>(StorageKeys.LOTS),
  saveBids: (bids: Bid[]) => storage.save(StorageKeys.BIDS, bids),
  loadBids: () => storage.load<Bid[]>(StorageKeys.BIDS),
  saveWatchlist: (items: WatchlistItem[]) => storage.save(StorageKeys.WATCHLIST, items),
  loadWatchlist: () => storage.load<WatchlistItem[]>(StorageKeys.WATCHLIST),
};
