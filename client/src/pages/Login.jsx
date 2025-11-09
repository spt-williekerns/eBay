// Login Page - Phone authentication (SMS verification)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState('phone'); // 'phone' or 'code'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const formatPhoneNumber = (value) => {
    // Auto-format as user types: (555) 123-4567
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Convert to E.164 format (+15551234567)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    const e164Phone = `+1${cleaned}`;

    try {
      const response = await api.post('/auth/send-code', {
        phone: e164Phone
      });

      if (response.data.success) {
        setStep('code');
        setMessage('Code sent! Check your text messages.');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Could not send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleaned = phone.replace(/\D/g, '');
    const e164Phone = `+1${cleaned}`;

    try {
      const response = await api.post('/auth/verify-code', {
        phone: e164Phone,
        code: code.trim(),
        name: name.trim()
      });

      if (response.data.success) {
        login(response.data.token, response.data.user);
        navigate('/');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to SeniorBid
          </h1>
          <p className="text-xl text-gray-600">
            Simple online auctions for your community
          </p>
        </div>

        {/* Card */}
        <div className="card">
          {message && (
            <div className="success mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="error mb-4">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            // Step 1: Enter phone number
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-xl font-semibold text-gray-900 mb-2">
                  Enter your phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder="(555) 123-4567"
                  className="input"
                  autoFocus
                  required
                  maxLength={14}
                />
                <p className="mt-2 text-base text-gray-600">
                  We'll text you a code to verify your number
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 14}
                className="btn-primary"
              >
                {loading ? 'Sending Code...' : 'Send Code'}
              </button>
            </form>
          ) : (
            // Step 2: Enter verification code + name (if new user)
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-xl font-semibold text-gray-900 mb-2">
                  Enter the 6-digit code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="input text-center text-2xl tracking-widest"
                  autoFocus
                  required
                  maxLength={6}
                />
                <p className="mt-2 text-base text-gray-600">
                  Check your text messages for the code
                </p>
              </div>

              <div>
                <label htmlFor="name" className="block text-xl font-semibold text-gray-900 mb-2">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="input"
                  required
                />
                <p className="mt-2 text-base text-gray-600">
                  (Only needed for first-time login)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="btn-primary"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setCode('');
                  setError(null);
                }}
                className="btn-secondary"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>

        {/* Help */}
        <p className="text-center text-lg text-gray-600 mt-6">
          Need help? Call <a href="tel:5551234567" className="text-blue-600 underline font-semibold">(555) 123-4567</a>
        </p>
      </div>
    </div>
  );
}
