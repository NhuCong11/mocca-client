/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { CreateOrderInfo, GetOrderInfo, RejectValueError } from '@/types';
import { callApi, HttpMethod } from '@/utils/apiUtils';

export const createOrder = createAsyncThunk<any, CreateOrderInfo, RejectValueError>(
  'createOrder',
  async (data: CreateOrderInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.POST, 'v1/orders', null, data, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const getOrder = createAsyncThunk<any, GetOrderInfo, RejectValueError>(
  'getOrder',
  async (params: GetOrderInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.GET, 'v1/orders/me', params, {}, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const cancelOrder = createAsyncThunk<any, string, RejectValueError>(
  'cancelOrder',
  async (orderID: string, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.POST, `v1/orders/${orderID}/cancel`, null, {}, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
