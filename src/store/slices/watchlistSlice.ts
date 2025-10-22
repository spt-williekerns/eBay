/**
 * Watchlist Slice - Redux State Management
 *
 * Manages watchlist with sorting and mass-delete functionality
 * Fixes bug: Enables mass-delete that was missing in original
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WatchlistItem, AuctionLot, SortOption, SortDirection } from '../../types';

interface WatchlistState {
  items: WatchlistItem[];
  lots: AuctionLot[];         // Populated lot details
  selectedItems: string[];    // For mass-delete
  sortBy: SortOption;
  sortDirection: SortDirection;
  loading: boolean;
  error: string | null;
}

const initialState: WatchlistState = {
  items: [],
  lots: [],
  selectedItems: [],
  sortBy: 'endTime',
  sortDirection: 'asc',
  loading: false,
  error: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<WatchlistItem>) => {
      // Prevent duplicates
      if (!state.items.find(item => item.lotId === action.payload.lotId)) {
        state.items.push(action.payload);
      }
    },

    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.lots = state.lots.filter(lot => lot.id !== action.payload);
    },

    // MASS DELETE - Bug fix: This was missing in original app
    massDeleteFromWatchlist: (state, action: PayloadAction<string[]>) => {
      const idsToDelete = action.payload;
      state.items = state.items.filter(item => !idsToDelete.includes(item.id));
      state.lots = state.lots.filter(lot => !idsToDelete.includes(lot.id));
      state.selectedItems = []; // Clear selection after delete
    },

    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.selectedItems.indexOf(itemId);
      if (index > -1) {
        state.selectedItems.splice(index, 1);
      } else {
        state.selectedItems.push(itemId);
      }
    },

    selectAllItems: (state) => {
      state.selectedItems = state.items.map(item => item.id);
    },

    clearSelection: (state) => {
      state.selectedItems = [];
    },

    setWatchlistLots: (state, action: PayloadAction<AuctionLot[]>) => {
      state.lots = action.payload;
    },

    // SORTING - Enhanced sorting options
    setSortOption: (state, action: PayloadAction<{ sortBy: SortOption; direction: SortDirection }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.direction;

      // Sort lots based on selected option
      state.lots.sort((a, b) => {
        let comparison = 0;

        switch (state.sortBy) {
          case 'endTime':
            comparison = new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
            break;
          case 'price':
            comparison = a.currentBid - b.currentBid;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'addedDate':
            const itemA = state.items.find(item => item.lotId === a.id);
            const itemB = state.items.find(item => item.lotId === b.id);
            if (itemA && itemB) {
              comparison = new Date(itemA.addedAt).getTime() - new Date(itemB.addedAt).getTime();
            }
            break;
        }

        return state.sortDirection === 'asc' ? comparison : -comparison;
      });
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
  addToWatchlist,
  removeFromWatchlist,
  massDeleteFromWatchlist,
  toggleItemSelection,
  selectAllItems,
  clearSelection,
  setWatchlistLots,
  setSortOption,
  setLoading,
  setError,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;
