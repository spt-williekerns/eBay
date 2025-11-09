// Home Page - Browse all auction items
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ItemCard } from '../components/ItemCard';
import api from '../utils/api';

export function Home() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data.items);
      setError(null);
    } catch (err) {
      setError('Could not load items. Please refresh the page.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              SeniorBid Auctions
            </h1>
            {user && (
              <p className="text-lg text-gray-600 mt-1">
                Welcome back, {user.name}!
              </p>
            )}
          </div>

          {user ? (
            <button
              onClick={logout}
              className="px-6 py-3 text-lg font-semibold text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Login
            </a>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Onboarding Banner (for first-time users) */}
        <div className="info mb-8">
          <h2 className="text-2xl font-bold mb-3">How it works:</h2>
          <ol className="space-y-2 text-lg">
            <li>1️⃣ Find an item you like below</li>
            <li>2️⃣ Tap it to see details</li>
            <li>3️⃣ Tap "Bid Now" to place your bid</li>
            <li>4️⃣ We'll text you if someone outbids you</li>
          </ol>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-600">Loading auctions...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error">
            {error}
            <p className="mt-2">
              Need help? Call <a href="tel:5551234567" className="underline font-bold">(555) 123-4567</a>
            </p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Current Auctions ({items.length})
            </h2>

            {items.length === 0 ? (
              // Empty State
              <div className="card text-center py-12">
                <p className="text-2xl text-gray-600">
                  No items right now. Check back soon!
                </p>
              </div>
            ) : (
              // Items Grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-16 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-2">
            📍 Pickup Location: 123 Main Street, Your Town
          </p>
          <p className="text-lg text-gray-600 mb-4">
            💵 Pay when you pick up (cash or card accepted)
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-base">
            <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>
            <a href="/terms" className="text-blue-600 underline">Terms of Service</a>
            <a href="tel:5551234567" className="text-blue-600 underline font-semibold">Call (555) 123-4567</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
