import React, { createContext, useContext, useLayoutEffect } from 'react';
import { socketService, SocketService } from './SocketService';

export const SOCKET_SERVER_URL = 'http://localhost:3030';

interface SocketContextValue {
  service: SocketService;
}

const SocketContext = createContext<SocketContextValue | null>(null);

interface SocketProviderProps {
  roomId: string;
  children: React.ReactNode;
}

/**
 * Manages the socket connection lifecycle for a single game room.
 */
export const SocketProvider = ({ roomId, children }: SocketProviderProps) => {
  useLayoutEffect(() => {
    console.log('SocketProvider: Connecting');
    socketService.connect(SOCKET_SERVER_URL, {
      roomId,
      // auth: { token: authToken }
    });
    console.log('SocketProvider: Connected');
    return () => {
      console.log('SocketProvider: Disconnecting');
      socketService.disconnect();
    };
  }, [roomId]);

  return <SocketContext.Provider value={{ service: socketService }}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextValue => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used inside SocketProvider');
  return ctx;
};
