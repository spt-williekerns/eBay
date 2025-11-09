// Terms of Service Page
export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>

          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                How Bidding Works
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Each bid increases the price by $5</li>
                <li>The highest bidder when the auction ends wins the item</li>
                <li>All bids are binding - if you bid, you're agreeing to buy</li>
                <li>Auctions may extend by 2 minutes if a bid is placed in the last 2 minutes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Payment and Pickup
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Winners must pick up items at 123 Main Street</li>
                <li>Payment is due at pickup (cash or card accepted)</li>
                <li>Items must be picked up within 7 days of auction end</li>
                <li>No shipping available - local pickup only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Item Condition
              </h2>
              <p>
                All items are sold "as-is" with no warranty or guarantee.
                We describe condition honestly, but items are from Amazon returns
                and may have issues not visible in photos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Cancellations and Refunds
              </h2>
              <p>
                Bids cannot be cancelled once placed. If you win an item and
                don't pick it up, you may be blocked from future bidding.
                No refunds after payment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Fair Use
              </h2>
              <p>
                We reserve the right to block users who:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Win items and don't pick them up</li>
                <li>Abuse the bidding system</li>
                <li>Harass other bidders or staff</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Questions?
              </h2>
              <p>
                Call us at{' '}
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
