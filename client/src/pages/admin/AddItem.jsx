// Add Item Page - Create new auction item
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export function AddItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: 'Works Great',
    starting_bid: '1',
    ends_at: ''
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        // Client-side compression could be added here
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/admin/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        return response.data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);

    } catch (err) {
      setError('Failed to upload images. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (images.length === 0) {
        setError('Please upload at least one image');
        setLoading(false);
        return;
      }

      const startingBid = parseFloat(formData.starting_bid);
      if (startingBid < 1 || startingBid > 100) {
        setError('Starting bid must be between $1 and $100');
        setLoading(false);
        return;
      }

      const endsAt = new Date(formData.ends_at);
      if (endsAt < new Date()) {
        setError('End time must be in the future');
        setLoading(false);
        return;
      }

      // Create item
      const response = await api.post('/admin/items', {
        ...formData,
        starting_bid: startingBid,
        image_urls: images
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        navigate('/admin');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Could not create item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 py-4 px-4 mb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Item
          </h1>
          <button
            onClick={() => navigate('/admin')}
            className="text-lg text-blue-600 underline font-semibold"
          >
            Cancel
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {error && (
          <div className="error mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="card">
            <label htmlFor="title" className="block text-xl font-semibold text-gray-900 mb-2">
              Item Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Toaster - 4 Slice Stainless Steel"
              className="input"
              required
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="card">
            <label htmlFor="description" className="block text-xl font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the item's condition, features, or any issues..."
              className="input"
              rows={5}
              maxLength={500}
            />
            <p className="mt-2 text-base text-gray-600">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Condition */}
          <div className="card">
            <label htmlFor="condition" className="block text-xl font-semibold text-gray-900 mb-2">
              Condition *
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="input"
              required
            >
              <option value="Works Great">Works Great - Fully functional</option>
              <option value="Minor Damage">Minor Damage - Cosmetic issues only</option>
              <option value="As-Is">As-Is - May not work properly</option>
            </select>
          </div>

          {/* Starting Bid */}
          <div className="card">
            <label htmlFor="starting_bid" className="block text-xl font-semibold text-gray-900 mb-2">
              Starting Bid ($) *
            </label>
            <input
              id="starting_bid"
              name="starting_bid"
              type="number"
              value={formData.starting_bid}
              onChange={handleInputChange}
              placeholder="1"
              className="input"
              required
              min="1"
              max="100"
              step="1"
            />
            <p className="mt-2 text-base text-gray-600">
              Must be between $1 and $100
            </p>
          </div>

          {/* End Time */}
          <div className="card">
            <label htmlFor="ends_at" className="block text-xl font-semibold text-gray-900 mb-2">
              Auction End Time *
            </label>
            <input
              id="ends_at"
              name="ends_at"
              type="datetime-local"
              value={formData.ends_at}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          {/* Photos */}
          <div className="card">
            <label className="block text-xl font-semibold text-gray-900 mb-2">
              Photos * (Max 5)
            </label>

            {/* Uploaded Images */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 5 && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`btn-secondary cursor-pointer inline-block text-center ${uploading ? 'opacity-50' : ''}`}
                >
                  {uploading ? 'Uploading...' : `Upload Images (${images.length}/5)`}
                </label>
                <p className="mt-2 text-base text-gray-600">
                  Max 5MB per image. JPG or PNG only.
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="card">
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn-primary"
            >
              {loading ? 'Creating Item...' : 'Create Auction Item'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
