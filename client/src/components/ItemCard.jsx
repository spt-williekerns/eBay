// ItemCard Component - Grid item for homepage
import { Link } from 'react-router-dom';
import { Countdown } from './Countdown';
import { formatCurrency } from '../utils/api';

const CONDITION_COLORS = {
  'Works Great': 'bg-green-100 text-green-800 border-green-300',
  'Minor Damage': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'As-Is': 'bg-orange-100 text-orange-800 border-orange-300'
};

export function ItemCard({ item }) {
  const firstImage = item.image_urls?.[0] || '/placeholder.jpg';

  return (
    <Link
      to={`/items/${item.id}`}
      className="card hover:border-blue-600 transition-all block"
    >
      {/* Photo */}
      <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
        <img
          src={firstImage}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
        {item.title}
      </h3>

      {/* Condition Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-base font-semibold border-2 mb-3 ${CONDITION_COLORS[item.condition]}`}>
        {item.condition}
      </div>

      {/* Current Bid */}
      <p className="text-3xl font-bold text-green-600 mb-2">
        {formatCurrency(item.current_bid)}
      </p>

      {/* Bid Count */}
      {item.bid_count > 0 && (
        <p className="text-base text-gray-600 mb-2">
          {item.bid_count} {item.bid_count === 1 ? 'bid' : 'bids'}
        </p>
      )}

      {/* Countdown */}
      <Countdown endsAt={item.ends_at} className="text-lg" />
    </Link>
  );
}
