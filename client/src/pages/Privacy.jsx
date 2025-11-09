// Privacy Policy Page
export function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                What Information We Collect
              </h2>
              <p>
                When you use SeniorBid, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your phone number (for login and SMS notifications)</li>
                <li>Your name (for identification)</li>
                <li>Your bidding history</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                How We Use Your Information
              </h2>
              <p>
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Allow you to place bids on items</li>
                <li>Send you text messages when you're outbid</li>
                <li>Notify you when you win an auction</li>
                <li>Communicate with you about your bids</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                SMS Text Messages
              </h2>
              <p>
                By using SeniorBid, you agree to receive text messages about your bids.
                You can stop receiving messages by not bidding on items.
                Message and data rates may apply.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Who We Share Your Information With
              </h2>
              <p>
                We do NOT sell or share your personal information with anyone,
                except as required to operate the service (e.g., Twilio for SMS).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your Rights
              </h2>
              <p>
                You can request to delete your account and all your information
                by calling us at (555) 123-4567.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Contact Us
              </h2>
              <p>
                Questions about privacy? Call us at{' '}
                <a href="tel:5551234567" className="text-blue-600 underline font-semibold">
                  (555) 123-4567
                </a>
              </p>
            </section>

            <p className="text-base text-gray-600 mt-8">
              Last updated: November 2025
            </p>
          </div>

          <div className="mt-8">
            <a href="/" className="btn-secondary inline-block">
              Back to Auctions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
