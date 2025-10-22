/**
 * Watchlist Tests
 *
 * Tests watchlist functionality including sorting and mass-delete
 */

import watchlistReducer, {
  addToWatchlist,
  removeFromWatchlist,
  massDeleteFromWatchlist,
  toggleItemSelection,
  selectAllItems,
  clearSelection,
  setSortOption,
} from '../store/slices/watchlistSlice';
import { WatchlistItem } from '../types';

describe('Watchlist Slice', () => {
  const initialState = {
    items: [],
    lots: [],
    selectedItems: [],
    sortBy: 'endTime' as const,
    sortDirection: 'asc' as const,
    loading: false,
    error: null,
  };

  it('adds item to watchlist', () => {
    const item: WatchlistItem = {
      id: '1',
      lotId: 'lot-1',
      addedAt: new Date().toISOString(),
    };

    const state = watchlistReducer(initialState, addToWatchlist(item));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('1');
  });

  it('removes item from watchlist', () => {
    const stateWithItem = {
      ...initialState,
      items: [
        {
          id: '1',
          lotId: 'lot-1',
          addedAt: new Date().toISOString(),
        },
      ],
    };

    const state = watchlistReducer(stateWithItem, removeFromWatchlist('1'));

    expect(state.items).toHaveLength(0);
  });

  it('mass deletes selected items', () => {
    const stateWithItems = {
      ...initialState,
      items: [
        { id: '1', lotId: 'lot-1', addedAt: new Date().toISOString() },
        { id: '2', lotId: 'lot-2', addedAt: new Date().toISOString() },
        { id: '3', lotId: 'lot-3', addedAt: new Date().toISOString() },
      ],
      selectedItems: ['1', '3'],
    };

    const state = watchlistReducer(
      stateWithItems,
      massDeleteFromWatchlist(['1', '3'])
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('2');
    expect(state.selectedItems).toHaveLength(0); // Selection cleared
  });

  it('toggles item selection', () => {
    const state1 = watchlistReducer(initialState, toggleItemSelection('1'));
    expect(state1.selectedItems).toContain('1');

    const state2 = watchlistReducer(state1, toggleItemSelection('1'));
    expect(state2.selectedItems).not.toContain('1');
  });

  it('selects all items', () => {
    const stateWithItems = {
      ...initialState,
      items: [
        { id: '1', lotId: 'lot-1', addedAt: new Date().toISOString() },
        { id: '2', lotId: 'lot-2', addedAt: new Date().toISOString() },
      ],
    };

    const state = watchlistReducer(stateWithItems, selectAllItems());

    expect(state.selectedItems).toHaveLength(2);
    expect(state.selectedItems).toEqual(['1', '2']);
  });

  it('clears selection', () => {
    const stateWithSelection = {
      ...initialState,
      selectedItems: ['1', '2', '3'],
    };

    const state = watchlistReducer(stateWithSelection, clearSelection());

    expect(state.selectedItems).toHaveLength(0);
  });

  it('updates sort option', () => {
    const state = watchlistReducer(
      initialState,
      setSortOption({ sortBy: 'price', direction: 'desc' })
    );

    expect(state.sortBy).toBe('price');
    expect(state.sortDirection).toBe('desc');
  });
});
