/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { RejectValueError } from '@/types';
import { callApi, HttpMethod } from '@/utils/apiUtils';
import { LoginInfo } from '@/app/[locale]/auth/signin/page';
import { SignUpInfo } from '@/app/[locale]/auth/signup/page';

export const loginUser = createAsyncThunk<any, LoginInfo, RejectValueError>(
  'auth/login',
  async (userCredentials: LoginInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(HttpMethod.POST, `/v1/auth/login`, null, userCredentials, customHeaders);
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const registerUser = createAsyncThunk<any, SignUpInfo, RejectValueError>(
  'auth/signup',
  async (userCredentials: SignUpInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const res: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/auth/register`,
        null,
        userCredentials,
        customHeaders,
      );
      return res;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
