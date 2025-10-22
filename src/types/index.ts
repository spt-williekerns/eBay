/**
 * Type Definitions for Marshall County Auction App
 *
 * Comprehensive types ensure type safety and prevent bugs
 * related to state management and data flow
 */

export interface User {
  id: string;
  bidderId: string;
  email: string;
  phone: string;
  name: string;
  town: string;              // For leaderboard (e.g., "Nashville, TN")
  avatar?: string;
  totalWins: number;
  totalBids: number;
  memberSince: string;
}

export interface AuctionEvent {
  id: string;
  title: string;
  location: string;          // Location-based filtering
  address: string;
  startDate: string;
  endDate: string;
  totalLots: number;
  activeLots: number;
  imageUrl?: string;
  description: string;
}

export interface AuctionLot {
  id: string;
  eventId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  startingBid: number;
  currentBid: number;
  maxBid?: number;           // User's max bid (always visible)
  finalPrice?: number;       // Final price (shown even for lost lots)
  bidIncrement: number;      // Default $1 for easy bidding
  endTime: string;
  status: 'active' | 'won' | 'lost' | 'pending';
  currentWinner?: string;
  totalBids: number;
  hasARPreview: boolean;     // AR preview availability
}

export interface Bid {
  id: string;
  lotId: string;
  userId: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
  isMaxBid: boolean;         // Is this the user's max bid?
}

export interface WatchlistItem {
  id: string;
  lotId: string;
  addedAt: string;
  notes?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  town: string;
  totalWins: number;
  totalBidAmount: number;
  badge?: string;            // e.g., "Nashville's #1 Bidder"
}

export type SortOption = 'endTime' | 'price' | 'title' | 'addedDate';
export type SortDirection = 'asc' | 'desc';

export interface AppSettings {
  voiceEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  hapticFeedback: boolean;
  autoRefresh: boolean;      // Always false - no refreshes!
}
