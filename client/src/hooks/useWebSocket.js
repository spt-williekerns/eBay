// WebSocket Hook for real-time bid updates
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useWebSocket(itemId) {
  const [socket, setSocket] = useState(null);
  const [lastBidUpdate, setLastBidUpdate] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    // Create WebSocket connection
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('🔌 WebSocket connected');
      setConnected(true);
      // Join item room
      socketInstance.emit('join_item', { itemId });
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      setConnected(false);
    });

    socketInstance.on('bid_update', (data) => {
      console.log('📡 Received bid update:', data);
      if (data.itemId === itemId) {
        setLastBidUpdate(data);
      }
    });

    socketInstance.on('auction_extended', (data) => {
      console.log('⏱️  Auction extended:', data);
      if (data.itemId === itemId) {
        // This will trigger a re-render with new end time
        setLastBidUpdate({ ...data, type: 'extended' });
      }
    });

    return () => {
      if (socketInstance) {
        socketInstance.emit('leave_item', { itemId });
        socketInstance.disconnect();
      }
    };
  }, [itemId]);

  return {
    socket,
    lastBidUpdate,
    connected
  };
}
