'use client';
import React, { createContext, useContext, useState } from 'react';

import { useAppDispatch } from '@/lib/hooks';
import { ChatMessageContextType, RestaurantInfo } from '@/types';
import { handleMobile, saveRestaurant } from '@/lib/features/chatsSlice';

const ChatMessageContext = createContext<ChatMessageContextType | undefined>(undefined);
export const useChatMessageContext = () => {
  const context = useContext(ChatMessageContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

const ChatMessageProvider = ({ children }: { children: Readonly<React.ReactNode> }) => {
  const dispatch = useAppDispatch();
  const [openMessage, setOpenMessage] = useState(false);
  const [newConversation, setNewConversation] = useState<RestaurantInfo>();

  const openMessageModal = () => setOpenMessage(true);
  const closeMessageModal = () => {
    setOpenMessage(false);
    dispatch(saveRestaurant(null));
    dispatch(handleMobile(false));
  };

  const addConversation = (newConversation: RestaurantInfo) => {
    setNewConversation(newConversation);
  };

  return (
    <ChatMessageContext.Provider
      value={{ openMessage, openMessageModal, closeMessageModal, newConversation, addConversation }}
    >
      {children}
    </ChatMessageContext.Provider>
  );
};

export default ChatMessageProvider;
