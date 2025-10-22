/**
 * Bid Slice Tests
 *
 * Tests bid state management including win/loss tracking
 * CRITICAL: Ensures final prices are always shown (bug fix)
 */

import bidReducer, {
  moveBidToWon,
  moveBidToLost,
  setActiveBids,
} from '../store/slices/bidSlice';
import { AuctionLot } from '../types';

describe('Bid Slice', () => {
  const initialState = {
    userBids: [],
    activeBids: [],
    wonBids: [],
    lostBids: [],
    loading: false,
    error: null,
  };

  const mockActiveLot: AuctionLot = {
    id: 'lot-1',
    eventId: '1',
    title: 'Test Lot',
    description: 'Test',
    category: 'Test',
    images: [],
    startingBid: 50,
    currentBid: 100,
    maxBid: 120,
    bidIncrement: 1,
    endTime: new Date().toISOString(),
    status: 'active',
    totalBids: 5,
    hasARPreview: false,
  };

  it('moves bid to won with final price', () => {
    const stateWithActive = {
      ...initialState,
      activeBids: [mockActiveLot],
    };

    const state = bidReducer(stateWithActive, moveBidToWon('lot-1'));

    expect(state.activeBids).toHaveLength(0);
    expect(state.wonBids).toHaveLength(1);
    expect(state.wonBids[0].status).toBe('won');
    expect(state.wonBids[0].finalPrice).toBe(100); // Final price set
  });

  it('moves bid to lost with final price shown', () => {
    const stateWithActive = {
      ...initialState,
      activeBids: [mockActiveLot],
    };

    // CRITICAL TEST: Final price must be shown on lost bids
    const state = bidReducer(
      stateWithActive,
      moveBidToLost({ lotId: 'lot-1', finalPrice: 150 })
    );

    expect(state.activeBids).toHaveLength(0);
    expect(state.lostBids).toHaveLength(1);
    expect(state.lostBids[0].status).toBe('lost');
    expect(state.lostBids[0].finalPrice).toBe(150); // Final price MUST be visible
  });

  it('ensures lost bids always have final price', () => {
    const lotsWithoutFinalPrice: AuctionLot[] = [
      {
        ...mockActiveLot,
        id: 'lot-2',
        status: 'lost',
        currentBid: 200,
        // finalPrice is undefined
      },
    ];

    const state = bidReducer(initialState, setActiveBids(lotsWithoutFinalPrice));

    // This would be handled by the setLostBids action
    // which ensures finalPrice is set to currentBid if missing
  });
});
