/**
 * User Slice - Redux State Management
 *
 * Manages user profile, settings, and authentication state
 * No screen refreshes - all updates happen through Redux actions
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AppSettings } from '../../types';

interface UserState {
  currentUser: User | null;
  settings: AppSettings;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  settings: {
    voiceEnabled: true,
    soundEnabled: true,
    notificationsEnabled: true,
    hapticFeedback: true,
    autoRefresh: false,        // NEVER auto-refresh for seniors
  },
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },

    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    incrementWins: (state) => {
      if (state.currentUser) {
        state.currentUser.totalWins += 1;
      }
    },

    incrementBids: (state) => {
      if (state.currentUser) {
        state.currentUser.totalBids += 1;
      }
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
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
  setUser,
  updateUserProfile,
  updateSettings,
  incrementWins,
  incrementBids,
  logout,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
