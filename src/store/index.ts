/**
 * Redux Store Configuration
 *
 * Central state management - NO screen refreshes!
 * All state updates happen through Redux actions for smooth UX
 */

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import userReducer from './slices/userSlice';
import auctionReducer from './slices/auctionSlice';
import bidReducer from './slices/bidSlice';
import watchlistReducer from './slices/watchlistSlice';
import leaderboardReducer from './slices/leaderboardSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auction: auctionReducer,
    bid: bidReducer,
    watchlist: watchlistReducer,
    leaderboard: leaderboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for date serialization
        ignoredActions: ['auction/setEvents', 'auction/setLots'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for better TypeScript support
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
