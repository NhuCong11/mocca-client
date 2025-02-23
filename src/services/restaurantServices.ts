/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { DefaultParams, RejectValueError } from '@/types';
import { callApi, HttpMethod } from '@/utils/apiUtils';

export const getRestaurants = createAsyncThunk<any, DefaultParams, RejectValueError>(
  'restaurants',
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

export const getRestaurantsByCategory = createAsyncThunk<
  any,
  { categoryID: string; params: DefaultParams },
  RejectValueError
>('restaurantsByCategory', async ({ categoryID, params }, { rejectWithValue }) => {
  try {
    const customHeaders = {
      'accept-language': `${getCookie('lang')}`,
    };
    const response: AxiosResponse = await callApi(
      HttpMethod.GET,
      `/v1/shops/category/${categoryID}`,
      params,
      {},
      customHeaders,
    );
    return response;
  } catch (error: any) {
    return rejectWithValue({ ...error });
  }
});

export const getRestaurantDetail = createAsyncThunk<any, string, RejectValueError>(
  'restaurantDetail',
  async (restaurantID, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(
        HttpMethod.GET,
        `/v1/shops/${restaurantID}/group-by-category`,
        null,
        {},
        customHeaders,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
