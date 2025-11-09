// Admin Dashboard - View all items
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/api';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/admin/items', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setItems(response.data.items);
      setError(null);
    } catch (err) {
      setError('Could not load items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await api.delete(`/admin/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      fetchItems(); // Refresh list
    } catch (err) {
      alert('Could not delete item');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 py-4 px-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin/add-item')}
              className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Add New Item
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {error && (
          <div className="error mb-6">{error}</div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All Items ({items.length})
        </h2>

        {items.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-2xl text-gray-600 mb-6">No items yet</p>
            <button
              onClick={() => navigate('/admin/add-item')}
              className="btn-primary max-w-md mx-auto"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const isActive = !item.deleted_at && new Date(item.ends_at) > new Date();
              const isEnded = new Date(item.ends_at) < new Date();

              return (
                <div
                  key={item.id}
                  className={`card ${item.deleted_at ? 'opacity-50' : ''}`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full md:w-48 h-48 flex-shrink-0">
                      <img
                        src={item.image_urls?.[0] || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>

                      <div className="space-y-2 text-lg text-gray-700">
                        <p><strong>Condition:</strong> {item.condition}</p>
                        <p><strong>Current Bid:</strong> {formatCurrency(item.current_bid)}</p>
                        <p><strong>Bids:</strong> {item.bid_count || 0}</p>
                        <p><strong>Ends:</strong> {new Date(item.ends_at).toLocaleString()}</p>

                        {item.deleted_at && (
                          <p className="text-red-600 font-bold">DELETED</p>
                        )}

                        {!item.deleted_at && isEnded && (
                          <p className="text-orange-600 font-bold">ENDED</p>
                        )}

                        {isActive && (
                          <p className="text-green-600 font-bold">ACTIVE</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        <a
                          href={`/items/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-base font-semibold text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          View
                        </a>

                        {!item.deleted_at && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-4 py-2 text-base font-semibold text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
