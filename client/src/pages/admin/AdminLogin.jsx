// Admin Login Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/admin/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Login
          </h1>
          <p className="text-xl text-gray-600">
            Store owner access only
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="error mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xl font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input"
                autoFocus
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xl font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <a
              href="/"
              className="block text-center text-lg text-blue-600 underline"
            >
              Back to Auctions
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
