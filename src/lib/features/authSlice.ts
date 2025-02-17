/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '@/types';
import { UNKNOWN_ERROR } from '@/constants';
import { getLocalStorageItem } from '@/utils/localStorage';
import {
  forgotPassword,
  getCaptcha,
  loginUser,
  loginWith2FA,
  registerUser,
  resetPassword,
  verifyOtpForgotPassword,
} from '@/services/authServices';
import { ActionRejectedType } from '../store';

export interface AuthState {
  loading: boolean;
  loadingUpdate: boolean;
  user: UserInfo | null;
  error: string | null;
  isLogin: boolean | null;
  status: string | null;
  secretKey: string;
  message: string;
  isUpdate: boolean;
  secretStatus: string | null;
  loadingCaptcha: boolean | null;
  captcha: null;
}

const initialState: AuthState = {
  loading: false,
  loadingUpdate: false,
  user: getLocalStorageItem('user') || null,
  error: null,
  isLogin: getLocalStorageItem('user') ? true : null,
  status: null,
  secretKey: '',
  message: '',
  isUpdate: false,
  secretStatus: null,
  loadingCaptcha: false,
  captcha: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,

  reducers: {
    reFreshStatus: (state) => {
      state.status = null;
      state.secretStatus = null;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // SignIn
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
        state.isLogin = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload?.code === 200 ? action.payload?.data?.user : null;
        state.error = null;
        state.isLogin = action.payload?.code === 200 ? true : false;
      })
      .addCase(loginUser.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload?.message || UNKNOWN_ERROR;
        state.isLogin = null;
      })
      // SignUp
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
        state.isLogin = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action?.payload;
        state.error = null;
        state.isLogin = null;
      })
      .addCase(registerUser.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload?.message || UNKNOWN_ERROR;
        state.isLogin = null;
      })
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.secretKey = action?.payload?.data?.secret;
        state.message = action?.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.message = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Get Captcha
      .addCase(getCaptcha.pending, (state) => {
        state.loadingCaptcha = true;
        state.error = null;
      })
      .addCase(getCaptcha.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingCaptcha = false;
        state.captcha = action?.payload?.data;
        state.message = action?.payload?.message;
      })
      .addCase(getCaptcha.rejected, (state, action: ActionRejectedType) => {
        state.loadingCaptcha = false;
        state.message = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Verify OTP ForgotPassword
      .addCase(verifyOtpForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpForgotPassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.secretKey = action?.payload?.data?.secret;
        state.message = action?.payload?.message;
      })
      .addCase(verifyOtpForgotPassword.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.message = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.secretKey = action?.payload?.data?.secret;
        state.message = action?.payload?.message;
      })
      .addCase(resetPassword.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.message = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Login with 2FA
      .addCase(loginWith2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWith2FA.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.message = action?.payload?.message;
      })
      .addCase(loginWith2FA.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.message = action?.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export const { reFreshStatus, logout } = authSlice.actions;
export default authSlice.reducer;
