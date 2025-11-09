// Countdown Timer Component
import { useCountdown } from '../hooks/useCountdown';

export function Countdown({ endsAt, className = '' }) {
  const { timeLeft, isEnded } = useCountdown(endsAt);

  if (isEnded) {
    return (
      <div className={`text-red-600 font-bold ${className}`}>
        🏁 Auction Ended
      </div>
    );
  }

  return (
    <div className={`text-gray-700 font-semibold ${className}`}>
      🕐 Ends in: {timeLeft}
    </div>
  );
}
