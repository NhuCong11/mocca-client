/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { callApi, HttpMethod } from '@/utils/apiUtils';
import { DefaultParams, RejectValueError } from '@/types';

export const searchProduct = createAsyncThunk<any, DefaultParams, RejectValueError>(
  'search-product',
  async (params: DefaultParams, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(HttpMethod.GET, `v1/products`, params, {}, customHeaders);
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
