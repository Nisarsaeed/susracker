// contexts/SocketContext.js
'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);         // Global alerts state
  const [unreadCount, setUnreadCount] = useState(0); // Notification badge count
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current) {
      const socketInstance = io('http://127.0.0.1:5000');
      setSocket(socketInstance);
      isConnected.current = true;

      socketInstance.on('connect', () => {
        console.log('Socket connected globally');
      });

      socketInstance.on('alert', (data) => {
        new Audio('/alert-sound.mp3').play().catch(console.error);
        const newAlert = { ...data, id: Date.now() };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep max 10
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socketInstance.disconnect();
        isConnected.current = false;
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{
      socket,
      alerts,
      setAlerts,
      unreadCount,
      setUnreadCount,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
