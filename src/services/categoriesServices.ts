/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DefaultParams, RejectValueError } from '@/types';
import { callApi, HttpMethod } from '@/utils/apiUtils';

export const getCategories = createAsyncThunk<any, DefaultParams, RejectValueError>(
  'categories',
  async (params: DefaultParams, { rejectWithValue }) => {
    try {
      const res: AxiosResponse = await callApi(HttpMethod.GET, `/v1/categories`, null, params);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
