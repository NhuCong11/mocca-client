/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { hostnameGHN } from '@/utils/constants';
import { GHNServicesProps } from '@/types';
import { UNKNOWN_ERROR } from '@/constants';

const customHeaders = {
  headers: {
    token: '00ba6bec-7b17-11ef-a572-2a014b19441b',
    shop_id: '5346523',
  },
};

const fetchFromGHN = async (endpoint: string, data: object | null = null) => {
  try {
    const res: AxiosResponse = await axios.post(`${hostnameGHN}${endpoint}`, data, customHeaders);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || UNKNOWN_ERROR);
  }
};

export const getCities = createAsyncThunk('getCities', async () => fetchFromGHN('master-data/province'));

export const getDistricts = createAsyncThunk('getDistricts', async ({ provinceID }: { provinceID: number }) =>
  fetchFromGHN('master-data/district', { province_id: provinceID }),
);

export const getWards = createAsyncThunk('getWards', async ({ districtID }: { districtID: number }) =>
  fetchFromGHN('master-data/ward', { district_id: districtID }),
);

export const getAvailableServices = createAsyncThunk(
  'getAvailableServices',
  async ({ fromDistrict, toDistrict }: { fromDistrict: number; toDistrict: number }) =>
    fetchFromGHN('v2/shipping-order/available-services', {
      shop_id: 5346523,
      from_district: fromDistrict,
      to_district: toDistrict,
    }),
);

export const gHNExpressFee = createAsyncThunk('gHNExpressFee', async (params: GHNServicesProps) =>
  fetchFromGHN('v2/shipping-order/fee', {
    service_id: params.serviceID,
    insurance_value: params.price,
    coupon: null,
    from_district_id: params.from_district_id,
    to_district_id: params.to_district_id,
    to_ward_code: params.to_ward_code,
    height: params.height,
    length: params.length,
    weight: params.weight,
    width: params.width,
  }),
);
