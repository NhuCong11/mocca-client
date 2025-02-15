/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '@/types';
import { UNKNOWN_ERROR } from '@/constants';
import { getLocalStorageItem } from '@/utils/localStorage';
import { loginUser, registerUser } from '@/services/authAPI';
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
      .addCase(registerUser.rejected, (state, action: PayloadAction<{ message: string } | undefined>) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload?.message || 'Unknown error';
        state.isLogin = null;
      });
  },
});

export const { reFreshStatus, logout } = authSlice.actions;
export default authSlice.reducer;
