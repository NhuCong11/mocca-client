/* eslint-disable @typescript-eslint/no-explicit-any */
import { contactUs } from '@/services/contactServices';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionRejectedType } from '../store';
import { UNKNOWN_ERROR } from '@/constants';

export interface ContactState {
  loading: boolean;
  contacts: null;
  error: string | null;
}

const initialState: ContactState = {
  loading: false,
  contacts: null,
  error: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(contactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.contacts = null;
      })
      .addCase(contactUs.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.contacts = action?.payload;
        state.error = null;
      })
      .addCase(contactUs.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.contacts = null;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export default contactSlice.reducer;
