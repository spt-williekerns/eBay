/**
 * Leaderboard Slice - Redux State Management
 *
 * Town-based leaderboard for excitement and community engagement
 * Example: "Nashville's #1 Bidder" creates friendly competition
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardEntry } from '../../types';

interface LeaderboardState {
  globalLeaderboard: LeaderboardEntry[];
  townLeaderboard: LeaderboardEntry[];
  userRank: number | null;
  userTownRank: number | null;
  selectedTown: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  globalLeaderboard: [],
  townLeaderboard: [],
  userRank: null,
  userTownRank: null,
  selectedTown: null,
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setGlobalLeaderboard: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.globalLeaderboard = action.payload;
    },

    setTownLeaderboard: (state, action: PayloadAction<{ town: string; entries: LeaderboardEntry[] }>) => {
      state.selectedTown = action.payload.town;
      state.townLeaderboard = action.payload.entries;
    },

    setUserRanks: (state, action: PayloadAction<{ global: number; town: number }>) => {
      state.userRank = action.payload.global;
      state.userTownRank = action.payload.town;
    },

    updateUserBadge: (state, action: PayloadAction<{ userId: string; badge: string }>) => {
      const globalEntry = state.globalLeaderboard.find(e => e.userId === action.payload.userId);
      if (globalEntry) {
        globalEntry.badge = action.payload.badge;
      }
      const townEntry = state.townLeaderboard.find(e => e.userId === action.payload.userId);
      if (townEntry) {
        townEntry.badge = action.payload.badge;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGlobalLeaderboard,
  setTownLeaderboard,
  setUserRanks,
  updateUserBadge,
  setLoading,
  setError,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
