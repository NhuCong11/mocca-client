/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '@/types';
import { UNKNOWN_ERROR } from '@/constants';
import { addOrUpdateFieldInLocalStorage, getLocalStorageItem } from '@/utils/localStorage';
import {
  changePassword,
  forgotPassword,
  getCaptcha,
  getMe,
  getSecretKey,
  loginUser,
  loginWith2FA,
  registerUser,
  resetPassword,
  toggle2FA,
  updateMe,
  updateSecretKey,
  verifyOtpForgotPassword,
} from '@/services/authServices';
import { ActionRejectedType } from '../store';

export interface AuthState {
  loading: boolean;
  loadingUpdate: boolean;
  user: UserInfo | null;
  error: string | null;
  isLogin: boolean | null;
  status: number | null;
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
      })
      // Get me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action?.payload?.data;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.user = null;
        state.error = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Update me
      .addCase(updateMe.pending, (state) => {
        state.loadingUpdate = true;
        state.error = null;
        state.isUpdate = false;
        state.user = null;
      })
      .addCase(updateMe.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.isUpdate = true;
        state.user = action.payload.data;
        state.error = null;
        addOrUpdateFieldInLocalStorage('user', null, action.payload.data);
      })
      .addCase(updateMe.rejected, (state, action: ActionRejectedType) => {
        state.loadingUpdate = false;
        state.isUpdate = false;
        state.user = null;
        state.error = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loadingUpdate = true;
        state.status = null;
        state.message = '';
      })
      .addCase(changePassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.status = action.payload?.code;
        state.message = '';
      })
      .addCase(changePassword.rejected, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.status = action.payload?.code;
        state.error = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Auth Twin Setup
      // Get Secret Key
      .addCase(getSecretKey.pending, (state) => {
        state.loadingUpdate = true;
        state.status = null;
        state.message = '';
      })
      .addCase(getSecretKey.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.status = action.payload?.code;
        state.message = '';
      })
      .addCase(getSecretKey.rejected, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.status = action.payload?.code;
        state.error = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Toggle 2FA
      .addCase(toggle2FA.pending, (state) => {
        state.loadingUpdate = true;
        state.status = null;
        state.message = '';
      })
      .addCase(toggle2FA.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.status = action.payload?.code;
        state.message = '';
      })
      .addCase(toggle2FA.rejected, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.status = action.payload?.code;
        state.error = action?.payload?.message || UNKNOWN_ERROR;
      })
      // Update Secret Key
      .addCase(updateSecretKey.pending, (state) => {
        state.loadingUpdate = true;
        state.status = null;
        state.message = '';
      })
      .addCase(updateSecretKey.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.status = action.payload?.code;
        state.message = '';
      })
      .addCase(updateSecretKey.rejected, (state, action: PayloadAction<any>) => {
        state.loadingUpdate = false;
        state.status = action.payload?.code;
        state.error = action?.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export const { reFreshStatus, logout } = authSlice.actions;
export default authSlice.reducer;
