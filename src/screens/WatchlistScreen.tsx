/**
 * Watchlist Screen - Sortable with Mass Delete
 *
 * Design Choices:
 * - Mass delete: Fix for missing feature in original app
 * - Multiple sort options: Flexible organization
 * - Large checkboxes: Easy selection for seniors
 * - Confirmation dialog: Prevent accidental deletions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setWatchlistLots,
  toggleItemSelection,
  selectAllItems,
  clearSelection,
  massDeleteFromWatchlist,
  setSortOption,
} from '../store/slices/watchlistSlice';
import { SortOption, SortDirection, AuctionLot } from '../types';
import { KentuckyLakeTheme } from '../theme/colors';
import { TextStyles } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { LotCard } from '../components/common/LotCard';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../theme/colors';
import { StorageHelpers } from '../utils/storage';

/**
 * Watchlist Screen Component
 *
 * Sortable list with mass-delete functionality (bug fix)
 */
export const WatchlistScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { lots, selectedItems, sortBy, sortDirection, loading } = useAppSelector(
    (state) => state.watchlist
  );
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    loadWatchlist();
  }, []);

  /**
   * Load watchlist from cache or API
   */
  const loadWatchlist = async () => {
    try {
      // In production, fetch from API
      const mockLots = generateMockWatchlistLots();
      dispatch(setWatchlistLots(mockLots));
      await StorageHelpers.saveWatchlist([]);
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
  };

  /**
   * Toggle selection mode
   */
  const toggleSelectionMode = () => {
    if (selectionMode) {
      dispatch(clearSelection());
    }
    setSelectionMode(!selectionMode);
  };

  /**
   * Select all items
   */
  const handleSelectAll = () => {
    dispatch(selectAllItems());
  };

  /**
   * Delete selected items with confirmation
   */
  const handleMassDelete = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select items to delete');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      `Delete ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}?`,
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: () => {
            dispatch(massDeleteFromWatchlist(selectedItems));
            setSelectionMode(false);
          },
        },
      ]
    );
  };

  /**
   * Handle sort option change
   */
  const handleSort = (option: SortOption, direction: SortDirection) => {
    dispatch(setSortOption({ sortBy: option, direction }));
    setShowSortModal(false);
  };

  /**
   * Navigate to lot details
   */
  const navigateToLot = (lot: AuctionLot) => {
    if (selectionMode) {
      dispatch(toggleItemSelection(lot.id));
    } else {
      navigation.navigate('LotDetails', { lot });
    }
  };

  /**
   * Render lot card with selection checkbox
   */
  const renderLotCard = ({ item }: { item: AuctionLot }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <View style={styles.lotContainer}>
        {selectionMode && (
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => dispatch(toggleItemSelection(item.id))}
          >
            <View
              style={[
                styles.checkboxBox,
                isSelected && styles.checkboxBoxSelected,
              ]}
            >
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }}>
          <LotCard lot={item} onPress={navigateToLot} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={Gradients.lake} style={styles.header}>
        <Text style={styles.headerTitle}>WATCHLIST</Text>
        <Text style={styles.itemCount}>{lots.length} Items</Text>
      </LinearGradient>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={toggleSelectionMode}
        >
          <Text style={styles.actionButtonText}>
            {selectionMode ? 'DONE' : 'SELECT'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.actionButtonText}>SORT</Text>
        </TouchableOpacity>

        {selectionMode && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSelectAll}
            >
              <Text style={styles.actionButtonText}>ALL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleMassDelete}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                DELETE ({selectedItems.length})
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Lot List */}
      <FlatList
        data={lots}
        renderItem={renderLotCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your watchlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Add items from auctions to watch them here
            </Text>
          </View>
        }
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SORT BY</Text>

            {renderSortOption('endTime', 'Ending Soon', 'asc')}
            {renderSortOption('price', 'Price: Low to High', 'asc')}
            {renderSortOption('price', 'Price: High to Low', 'desc')}
            {renderSortOption('title', 'Title: A-Z', 'asc')}
            {renderSortOption('addedDate', 'Recently Added', 'desc')}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.modalCloseText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  /**
   * Render sort option button
   */
  function renderSortOption(
    option: SortOption,
    label: string,
    direction: SortDirection
  ) {
    const isSelected = sortBy === option && sortDirection === direction;

    return (
      <TouchableOpacity
        style={[styles.sortOption, isSelected && styles.sortOptionSelected]}
        onPress={() => handleSort(option, direction)}
      >
        <Text style={[styles.sortOptionText, isSelected && styles.sortOptionTextSelected]}>
          {label}
        </Text>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  }
};

/**
 * Generate mock watchlist lots
 */
const generateMockWatchlistLots = (): AuctionLot[] => [
  {
    id: 'lot-w1',
    eventId: '1',
    title: 'Kentucky Dam Commemorative Plate',
    description: 'Limited edition plate from 1950s',
    category: 'Collectibles',
    images: [],
    startingBid: 15,
    currentBid: 45,
    bidIncrement: 1,
    endTime: new Date(Date.now() + 7200000).toISOString(),
    status: 'active',
    totalBids: 5,
    hasARPreview: false,
  },
  {
    id: 'lot-w2',
    eventId: '1',
    title: 'Antique Banjo',
    description: 'Vintage 5-string banjo',
    category: 'Musical Instruments',
    images: [],
    startingBid: 100,
    currentBid: 275,
    bidIncrement: 1,
    endTime: new Date(Date.now() + 10800000).toISOString(),
    status: 'active',
    totalBids: 12,
    hasARPreview: true,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KentuckyLakeTheme.backgroundDark,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.screen.horizontal,
  },
  headerTitle: {
    ...TextStyles.h1,
    color: KentuckyLakeTheme.white,
  },
  itemCount: {
    fontSize: 36,
    fontWeight: '600',
    color: KentuckyLakeTheme.cream,
    marginTop: Spacing.xs,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: KentuckyLakeTheme.backgroundLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: KentuckyLakeTheme.lakeBlue,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    marginHorizontal: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  actionButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: KentuckyLakeTheme.white,
  },
  deleteButton: {
    backgroundColor: KentuckyLakeTheme.vibrantRed,
  },
  deleteButtonText: {
    color: KentuckyLakeTheme.white,
  },
  listContent: {
    paddingVertical: Spacing.md,
  },
  lotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    paddingHorizontal: Spacing.md,
  },
  checkboxBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: KentuckyLakeTheme.damGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxSelected: {
    backgroundColor: KentuckyLakeTheme.lakeBlue,
    borderColor: KentuckyLakeTheme.lakeBlue,
  },
  checkmark: {
    fontSize: 32,
    fontWeight: '700',
    color: KentuckyLakeTheme.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...TextStyles.h2,
    color: KentuckyLakeTheme.damGray,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 36,
    color: KentuckyLakeTheme.damGray,
    marginTop: Spacing.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: KentuckyLakeTheme.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: KentuckyLakeTheme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
  },
  modalTitle: {
    ...TextStyles.h2,
    color: KentuckyLakeTheme.textDark,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: 12,
    backgroundColor: KentuckyLakeTheme.backgroundLight,
  },
  sortOptionSelected: {
    backgroundColor: KentuckyLakeTheme.lakeBlue,
  },
  sortOptionText: {
    fontSize: 38,
    fontWeight: '600',
    color: KentuckyLakeTheme.textDark,
  },
  sortOptionTextSelected: {
    color: KentuckyLakeTheme.white,
  },
  modalCloseButton: {
    backgroundColor: KentuckyLakeTheme.damGray,
    height: Spacing.touchTarget.button,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  modalCloseText: {
    ...TextStyles.button,
    color: KentuckyLakeTheme.white,
  },
});
