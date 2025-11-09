// Item Detail Page - View item and place bids
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../hooks/useWebSocket';
import { Countdown } from '../components/Countdown';
import { BidButton } from '../components/BidButton';
import { formatCurrency } from '../utils/api';
import api from '../utils/api';

const CONDITION_INFO = {
  'Works Great': { emoji: '✅', color: 'text-green-600', description: 'Item is fully functional' },
  'Minor Damage': { emoji: '⚠️', color: 'text-yellow-600', description: 'Small cosmetic issues' },
  'As-Is': { emoji: '❓', color: 'text-orange-600', description: 'Sold as-is, may not work' }
};

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { lastBidUpdate, connected } = useWebSocket(parseInt(id));

  useEffect(() => {
    fetchItem();
  }, [id]);

  // Update item when WebSocket receives bid update
  useEffect(() => {
    if (lastBidUpdate && item) {
      setItem(prev => ({
        ...prev,
        current_bid: lastBidUpdate.newBid,
        ends_at: lastBidUpdate.endsAt || prev.ends_at
      }));
    }
  }, [lastBidUpdate]);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data.item);
      setError(null);
    } catch (err) {
      setError('Could not load item. Please try again.');
      console.error('Error fetching item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSuccess = (data) => {
    // Update local state with new bid
    setItem(prev => ({
      ...prev,
      current_bid: data.newBid
    }));

    // Refresh item data
    fetchItem();
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? (item.image_urls?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev =>
      prev === (item.image_urls?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading item...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md">
          <div className="error mb-4">{error || 'Item not found'}</div>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  const conditionInfo = CONDITION_INFO[item.condition];
  const images = item.image_urls && item.image_urls.length > 0
    ? item.image_urls
    : ['/placeholder.jpg'];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 py-4 px-4 mb-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-xl text-blue-600 font-semibold hover:underline"
          >
            ← Back to Auctions
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {/* Connection Status */}
        {!connected && (
          <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-3 mb-4 text-yellow-800 text-base">
            Reconnecting to live updates...
          </div>
        )}

        {/* Photo Carousel */}
        <div className="relative mb-6">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={images[currentImageIndex]}
              alt={`${item.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Photo Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-4 shadow-lg hover:bg-opacity-100 text-3xl"
                aria-label="Previous image"
              >
                ◄
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-4 shadow-lg hover:bg-opacity-100 text-3xl"
                aria-label="Next image"
              >
                ►
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-lg font-semibold">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Item Info */}
        <div className="card mb-6">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {item.title}
          </h1>

          {/* Condition */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{conditionInfo.emoji}</span>
            <div>
              <p className={`text-2xl font-bold ${conditionInfo.color}`}>
                {item.condition}
              </p>
              <p className="text-lg text-gray-600">
                {conditionInfo.description}
              </p>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* Countdown */}
          <Countdown endsAt={item.ends_at} className="text-2xl mb-6" />
        </div>

        {/* Bidding Section */}
        <div className="card bg-blue-50 border-blue-300">
          {/* Current Bid */}
          <div className="text-center mb-6">
            <p className="text-xl text-gray-700 mb-2">Current Bid</p>
            <p className="text-5xl font-bold text-green-600">
              {formatCurrency(item.current_bid)}
            </p>
          </div>

          {/* Bid Button */}
          <BidButton item={item} user={user} onBidSuccess={handleBidSuccess} />

          {!user && (
            <div className="mt-4 text-center">
              <a href="/login" className="text-xl text-blue-600 underline font-semibold">
                Login to place a bid
              </a>
            </div>
          )}
        </div>

        {/* Pickup Info */}
        <div className="card mt-6 bg-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pickup Information</h2>
          <div className="space-y-3 text-xl text-gray-700">
            <p>📍 <strong>Location:</strong> 123 Main Street, Your Town</p>
            <p>💵 <strong>Payment:</strong> Pay when you pick up (cash or card)</p>
            <p>📞 <strong>Questions?</strong> Call <a href="tel:5551234567" className="text-blue-600 underline font-semibold">(555) 123-4567</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}
