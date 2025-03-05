/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionRejectedType } from '../store';
import { MessageItemInfo } from '@/types';
import { UNKNOWN_ERROR } from '@/constants';
import { chatBot, getConversations, getMessages, sendMessage } from '@/services/chatsServices';

interface ChatState {
  loading: boolean;
  messagesLoading: boolean;
  messageLoading: boolean;
  data: any | null;
  messages: MessageItemInfo[];
  restaurant: any | null;
  error: string | null;
  isMobile: boolean;
}

const initialState: ChatState = {
  loading: false,
  messagesLoading: false,
  messageLoading: false,
  data: null,
  messages: [],
  restaurant: null,
  error: null,
  isMobile: false,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState: initialState,
  reducers: {
    saveRestaurant: (state, action) => {
      state.restaurant = action.payload;
    },
    handleMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers(builder) {
    builder
      // Chatbot
      .addCase(chatBot.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(chatBot.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload?.data;
        state.error = null;
      })
      .addCase(chatBot.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      })
      // Get Conversations
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload?.data;
        state.error = null;
      })
      .addCase(getConversations.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      })
      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.messagesLoading = true;
        state.messages = [];
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action: PayloadAction<any>) => {
        state.messagesLoading = false;
        state.messages = action.payload?.data;
        state.error = null;
      })
      .addCase(getMessages.rejected, (state, action: ActionRejectedType) => {
        state.messagesLoading = false;
        state.messages = [];
        state.error = action.payload?.message || UNKNOWN_ERROR;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<any>) => {
        state.messageLoading = false;
        state.messages = [...state.messages, action.payload?.data];
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action: ActionRejectedType) => {
        state.messageLoading = false;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export const { saveRestaurant, handleMobile, addMessage } = chatsSlice.actions;
export default chatsSlice.reducer;
