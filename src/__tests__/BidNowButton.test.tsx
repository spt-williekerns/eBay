/**
 * BidNowButton Component Tests
 *
 * Tests the one-tap bidding functionality
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { BidNowButton } from '../components/bidding/BidNowButton';

describe('BidNowButton', () => {
  it('renders with correct bid amount', () => {
    const { getByText } = render(
      <BidNowButton currentBid={100} onBid={jest.fn()} />
    );

    expect(getByText('BID NOW')).toBeTruthy();
    expect(getByText('$101')).toBeTruthy(); // Current + $1 increment
  });

  it('calls onBid with incremented amount when pressed', async () => {
    const mockOnBid = jest.fn().mockResolvedValue(undefined);
    const { getByText } = render(
      <BidNowButton currentBid={50} onBid={mockOnBid} />
    );

    fireEvent.press(getByText('BID NOW'));

    await waitFor(() => {
      expect(mockOnBid).toHaveBeenCalledWith(51);
    });
  });

  it('uses custom increment when provided', () => {
    const { getByText } = render(
      <BidNowButton currentBid={100} increment={5} onBid={jest.fn()} />
    );

    expect(getByText('$105')).toBeTruthy(); // Current + $5 increment
  });

  it('disables button when disabled prop is true', () => {
    const mockOnBid = jest.fn();
    const { getByText } = render(
      <BidNowButton currentBid={100} onBid={mockOnBid} disabled={true} />
    );

    fireEvent.press(getByText('BID NOW'));

    expect(mockOnBid).not.toHaveBeenCalled();
  });

  it('shows loading state while bid is processing', async () => {
    const mockOnBid = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const { getByText, queryByText } = render(
      <BidNowButton currentBid={100} onBid={mockOnBid} />
    );

    fireEvent.press(getByText('BID NOW'));

    // Button text should be hidden during loading
    await waitFor(() => {
      expect(queryByText('BID NOW')).toBeNull();
    });
  });
});
