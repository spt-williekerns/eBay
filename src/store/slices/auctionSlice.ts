/**
 * Auction Slice - Redux State Management
 *
 * Manages auction events and lots
 * Location-based filtering for easy discovery
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuctionEvent, AuctionLot } from '../../types';

interface AuctionState {
  events: AuctionEvent[];
  lots: AuctionLot[];
  selectedEvent: AuctionEvent | null;
  selectedLot: AuctionLot | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: AuctionState = {
  events: [],
  lots: [],
  selectedEvent: null,
  selectedLot: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<AuctionEvent[]>) => {
      state.events = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    setLots: (state, action: PayloadAction<AuctionLot[]>) => {
      state.lots = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addEvent: (state, action: PayloadAction<AuctionEvent>) => {
      state.events.unshift(action.payload);
    },

    addLot: (state, action: PayloadAction<AuctionLot>) => {
      state.lots.unshift(action.payload);
    },

    updateLot: (state, action: PayloadAction<Partial<AuctionLot> & { id: string }>) => {
      const index = state.lots.findIndex(lot => lot.id === action.payload.id);
      if (index !== -1) {
        state.lots[index] = { ...state.lots[index], ...action.payload };
      }
      // Also update selected lot if it's the same one
      if (state.selectedLot?.id === action.payload.id) {
        state.selectedLot = { ...state.selectedLot, ...action.payload };
      }
    },

    updateLotBid: (state, action: PayloadAction<{ lotId: string; newBid: number; finalPrice?: number }>) => {
      const { lotId, newBid, finalPrice } = action.payload;
      const lot = state.lots.find(l => l.id === lotId);
      if (lot) {
        lot.currentBid = newBid;
        lot.totalBids += 1;
        if (finalPrice !== undefined) {
          lot.finalPrice = finalPrice; // Always show final price
        }
      }
    },

    setSelectedEvent: (state, action: PayloadAction<AuctionEvent | null>) => {
      state.selectedEvent = action.payload;
    },

    setSelectedLot: (state, action: PayloadAction<AuctionLot | null>) => {
      state.selectedLot = action.payload;
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
  setEvents,
  setLots,
  addEvent,
  addLot,
  updateLot,
  updateLotBid,
  setSelectedEvent,
  setSelectedLot,
  setLoading,
  setError,
} = auctionSlice.actions;

export default auctionSlice.reducer;
