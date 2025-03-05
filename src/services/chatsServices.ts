/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { callApi, HttpMethod } from '@/utils/apiUtils';
import { GetMessagesProps, RejectValueError, SendMessageProps } from '@/types';

export const chatBot = createAsyncThunk<any, string, RejectValueError>(
  'chatBot',
  async (message: string, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.POST, `/v1/chat-bots`, null, { message }, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const getConversations = createAsyncThunk<any, string, RejectValueError>(
  'getConversations',
  async (userID: string, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/chats/users`,
        null,
        { userId: userID },
        customHeaders,
      );
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const getMessages = createAsyncThunk<any, GetMessagesProps, RejectValueError>(
  'getMessages',
  async ({ userID, conversationID }: GetMessagesProps, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/chats`,
        null,
        { senderId: userID, receiverId: conversationID },
        customHeaders,
      );
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const sendMessage = createAsyncThunk<any, SendMessageProps, RejectValueError>(
  'sendMessage',
  async ({ message, conversationID, image }: SendMessageProps, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
        'Content-Type': 'multipart/form-data',
      };

      const messageData = new FormData();
      messageData.append('receiverId', conversationID);
      if (message) {
        messageData.append('message', message);
      } else {
        messageData.append('message', '');
      }
      if (image) {
        messageData.append('image', image);
      }

      const res: AxiosResponse = await callApi(HttpMethod.POST, `/v1/chats/send`, null, messageData, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
