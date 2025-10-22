/**
 * Bid Slice - Redux State Management
 *
 * Manages user bids with active/won/lost categorization
 * Ensures max bid and final prices are always visible (bug fix)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bid, AuctionLot } from '../../types';

interface BidState {
  userBids: Bid[];
  activeBids: AuctionLot[];    // Lots with active bids
  wonBids: AuctionLot[];       // Won lots
  lostBids: AuctionLot[];      // Lost lots (with final price visible)
  loading: boolean;
  error: string | null;
}

const initialState: BidState = {
  userBids: [],
  activeBids: [],
  wonBids: [],
  lostBids: [],
  loading: false,
  error: null,
};

const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {
    addBid: (state, action: PayloadAction<Bid>) => {
      state.userBids.unshift(action.payload);
    },

    setActiveBids: (state, action: PayloadAction<AuctionLot[]>) => {
      state.activeBids = action.payload;
    },

    setWonBids: (state, action: PayloadAction<AuctionLot[]>) => {
      state.wonBids = action.payload;
    },

    setLostBids: (state, action: PayloadAction<AuctionLot[]>) => {
      // Ensure final price is always included (bug fix)
      state.lostBids = action.payload.map(lot => ({
        ...lot,
        finalPrice: lot.finalPrice || lot.currentBid, // Always show final price
      }));
    },

    moveBidToWon: (state, action: PayloadAction<string>) => {
      const lotId = action.payload;
      const lotIndex = state.activeBids.findIndex(lot => lot.id === lotId);
      if (lotIndex !== -1) {
        const [wonLot] = state.activeBids.splice(lotIndex, 1);
        wonLot.status = 'won';
        wonLot.finalPrice = wonLot.currentBid; // Set final price
        state.wonBids.unshift(wonLot);
      }
    },

    moveBidToLost: (state, action: PayloadAction<{ lotId: string; finalPrice: number }>) => {
      const { lotId, finalPrice } = action.payload;
      const lotIndex = state.activeBids.findIndex(lot => lot.id === lotId);
      if (lotIndex !== -1) {
        const [lostLot] = state.activeBids.splice(lotIndex, 1);
        lostLot.status = 'lost';
        lostLot.finalPrice = finalPrice; // CRITICAL: Show final price on lost bids
        state.lostBids.unshift(lostLot);
      }
    },

    updateBidStatus: (state, action: PayloadAction<{ lotId: string; isWinning: boolean }>) => {
      const { lotId, isWinning } = action.payload;
      const lot = state.activeBids.find(l => l.id === lotId);
      if (lot) {
        // Update status without refreshing the screen
        const relatedBids = state.userBids.filter(b => b.lotId === lotId);
        relatedBids.forEach(bid => {
          bid.isWinning = isWinning;
        });
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
  addBid,
  setActiveBids,
  setWonBids,
  setLostBids,
  moveBidToWon,
  moveBidToLost,
  updateBidStatus,
  setLoading,
  setError,
} = bidSlice.actions;

export default bidSlice.reducer;
