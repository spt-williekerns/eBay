// Countdown Timer Hook
import { useState, useEffect } from 'react';
import { formatTimeRemaining } from '../utils/api';

export function useCountdown(endsAt) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!endsAt) return;

    // Update immediately
    const updateTimer = () => {
      const formatted = formatTimeRemaining(endsAt);
      setTimeLeft(formatted);
      setIsEnded(formatted === 'Ended');
    };

    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  return { timeLeft, isEnded };
}
