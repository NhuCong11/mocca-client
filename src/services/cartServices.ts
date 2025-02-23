/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { RejectValueError } from '@/types';
import { callApi, HttpMethod } from '@/utils/apiUtils';
import { ChangeCartInfo } from '@/types';

export const displayProductsInCart = createAsyncThunk<any, undefined, RejectValueError>(
  'displayProductsInCart',
  async (_, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.GET, 'v1/carts/me', null, null, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const addProductToCart = createAsyncThunk<any, ChangeCartInfo, RejectValueError>(
  'addProductToCart',
  async (data: ChangeCartInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.POST, 'v1/carts/add-product', null, data, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const deleteProductFromCart = createAsyncThunk<any, ChangeCartInfo, RejectValueError>(
  'deleteProductFromCart',
  async (data: ChangeCartInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.PUT, 'v1/carts/remove-product', null, data, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
