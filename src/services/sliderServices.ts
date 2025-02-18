/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { DefaultParams, RejectValueError } from '@/types';
import { callApi, HttpMethod } from '@/utils/apiUtils';

export const getSlider = createAsyncThunk<any, DefaultParams, RejectValueError>(
  'getSlider',
  async (params: DefaultParams, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(HttpMethod.GET, `/v1/shops`, params, {}, customHeaders);
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
