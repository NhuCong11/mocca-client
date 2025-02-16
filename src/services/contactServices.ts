/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { RejectValueError } from '@/types';
import { callApi, HttpMethod } from '@/utils/apiUtils';
import { ContactInfo } from '@/app/[locale]/about/page';

export const contactUs = createAsyncThunk<any, ContactInfo, RejectValueError>(
  'contact',
  async (communications: ContactInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.POST, `/v1/contacts`, null, communications, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
