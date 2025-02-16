/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { RejectValueError } from '@/types';
import { callApi, HttpMethod } from '@/utils/apiUtils';
import { LoginInfo } from '@/app/[locale]/auth/signin/page';
import { SignUpInfo } from '@/app/[locale]/auth/signup/page';
import { ForgotPasswordInfo } from '@/app/[locale]/auth/forgot-password/page';

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

export const forgotPassword = createAsyncThunk<any, ForgotPasswordInfo, RejectValueError>(
  'auth/forgot-password',
  async (data: ForgotPasswordInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/auth/forgot-password`,
        null,
        data,
        customHeaders,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const getCaptcha = createAsyncThunk<any, undefined, RejectValueError>(
  'auth/get-captcha',
  async (_, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response = await callApi(HttpMethod.GET, `/v1/captcha/generate`, null, {}, customHeaders);
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);
