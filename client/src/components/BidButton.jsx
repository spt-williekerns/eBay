// BidButton Component - Main CTA for bidding
import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { formatCurrency } from '../utils/api';
import api from '../utils/api';

export function BidButton({ item, user, onBidSuccess }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isEnded = new Date(item.ends_at) < new Date();
  const nextBid = item.current_bid + 500; // $5 increment

  // Determine if button should be disabled
  const disabled = !user || isEnded || success;

  const getButtonText = () => {
    if (!user) return 'Login to Bid';
    if (isEnded) return 'Auction Ended';
    if (success) return "You're Winning! 🎉";
    return `Bid ${formatCurrency(nextBid)}`;
  };

  const handleClick = () => {
    if (disabled) return;
    setError(null);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/items/${item.id}/bid`, {
        amount: nextBid
      });

      if (response.data.success) {
        setSuccess(true);
        setShowConfirm(false);

        // Call parent callback
        if (onBidSuccess) {
          onBidSuccess(response.data);
        }

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Could not place bid. Please try again.';
      setError(errorMessage);
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="error">
          {error}
          <p className="mt-2 text-base">
            Need help? Call <a href="tel:5551234567" className="underline font-bold">(555) 123-4567</a>
          </p>
        </div>
      )}

      {/* Bid Button */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`btn-primary ${success ? 'bg-green-600 hover:bg-green-600' : ''}`}
      >
        {getButtonText()}
      </button>

      {/* Helper Text */}
      {!user && (
        <p className="text-center text-base text-gray-600">
          You must be logged in to place a bid
        </p>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        amount={nextBid}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    </div>
  );
}
