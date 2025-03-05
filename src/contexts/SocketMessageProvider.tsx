/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';

import { RestaurantInfo, SocketMessageType } from '@/types';
import { hostname } from '@/utils/constants';

const SocketMessage = createContext<SocketMessageType | undefined>(undefined);

export const useSocketMessage = () => {
  const context = useContext(SocketMessage);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

const SocketMessageProvider = ({ children }: { children: Readonly<React.ReactNode> }) => {
  const authUser = useSelector((state: any) => state.auth.user);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<RestaurantInfo[]>([]);

  useEffect(() => {
    if (authUser) {
      const newSocket = io(hostname, {
        query: { userId: authUser._id },
      });

      newSocket.on('getOnlineUsers', (users: RestaurantInfo[]) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return <SocketMessage.Provider value={{ socket, onlineUsers }}>{children}</SocketMessage.Provider>;
};

export default SocketMessageProvider;
