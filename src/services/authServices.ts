/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'typescript-cookie';
import { callApi, HttpMethod } from '@/utils/apiUtils';
import { LoginInfo } from '@/app/[locale]/auth/signin/page';
import { SignUpInfo } from '@/app/[locale]/auth/signup/page';
import { ForgotPasswordInfo } from '@/app/[locale]/auth/forgot-password/page';
import { LoginWWith2FA } from '@/app/[locale]/auth/login-with-2fa/page';
import { ResetPasswordInfo } from '@/app/[locale]/auth/reset-password/page';
import { VerifyOTPForgotPasswordInfo } from '@/app/[locale]/auth/verify-otp/page';
import { ChangePasswordInfo, RejectValueError, UpdateSecretKeyProps, UserInfo } from '@/types';

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

export const verifyOtpForgotPassword = createAsyncThunk<any, VerifyOTPForgotPasswordInfo, RejectValueError>(
  'auth/verify-otp',
  async (data: VerifyOTPForgotPasswordInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/auth/verify-otp-forgot-password`,
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

export const resetPassword = createAsyncThunk<any, ResetPasswordInfo, RejectValueError>(
  'auth/reset-password',
  async (data: ResetPasswordInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/auth/reset-password`,
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

export const loginWith2FA = createAsyncThunk<any, LoginWWith2FA, RejectValueError>(
  'auth/loginWith2FA',
  async (data: LoginWWith2FA, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/auth/login-with-2fa`,
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

export const getMe = createAsyncThunk<any, undefined, RejectValueError>(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(HttpMethod.GET, `/v1/auth/me`, null, {}, customHeaders);
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const updateMe = createAsyncThunk<
  any,
  { userData: UserInfo; avatar: File | null; background: File | null },
  RejectValueError
>(
  'auth/updateMe',
  async (
    { userData, avatar, background }: { userData: UserInfo; avatar: File | null; background: File | null },
    { rejectWithValue },
  ) => {
    try {
      const customHeaders = {
        'Content-Type': 'multipart/form-data',
        'accept-language': `${getCookie('lang')}`,
      };

      const formData = new FormData();
      // Thêm dữ liệu người dùng vào formData
      Object.keys(userData).forEach((key) => {
        formData.append(key as keyof UserInfo, userData[key as keyof UserInfo] as string);
      });
      // Thêm ảnh vào formData
      if (avatar) {
        formData.append('avatar', avatar);
      }
      if (background) {
        formData.append('background', background);
      }

      const response: AxiosResponse = await callApi(HttpMethod.PUT, `/v1/auth/me`, null, formData, customHeaders);
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const changePassword = createAsyncThunk<any, ChangePasswordInfo, RejectValueError>(
  'auth/changePassword',
  async (userData: ChangePasswordInfo, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/auth/change-password`,
        null,
        userData,
        customHeaders,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const getSecretKey = createAsyncThunk<any, undefined, RejectValueError>(
  'auth/getSecretKey',
  async (_, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(
        HttpMethod.POST,
        `/v1/auth/generate-2fa-secret`,
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

export const toggle2FA = createAsyncThunk<any, Record<string, any>, RejectValueError>(
  'auth/toggle2FA',
  async (code: Record<string, any>, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(HttpMethod.POST, `v1/auth/toggle-2fa`, null, code, customHeaders);
      return response;
    } catch (error: any) {
      return rejectWithValue({ ...error });
    }
  },
);

export const updateSecretKey = createAsyncThunk<any, UpdateSecretKeyProps, RejectValueError>(
  'auth/update-secret-key',
  async (data: UpdateSecretKeyProps, { rejectWithValue }) => {
    try {
      const customHeaders = {
        'accept-language': `${getCookie('lang')}`,
      };
      const response: AxiosResponse = await callApi(
        HttpMethod.POST,
        `v1/auth/change-2fa-secret`,
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
