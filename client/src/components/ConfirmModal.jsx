// Confirmation Modal (prevent accidental bids)
import { formatCurrency } from '../utils/api';

export function ConfirmModal({ isOpen, amount, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Are you sure?
        </h2>

        <p className="text-xl text-gray-700 mb-6 leading-relaxed">
          You are about to bid <span className="font-bold text-green-600">{formatCurrency(amount)}</span> on this item.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Placing Bid...' : `Yes, Bid ${formatCurrency(amount)}`}
          </button>

          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary"
          >
            Nevermind
          </button>
        </div>
      </div>
    </div>
  );
}
