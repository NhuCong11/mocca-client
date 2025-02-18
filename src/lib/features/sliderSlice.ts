/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSlider } from '@/services/sliderServices';
import { ActionRejectedType } from '../store';
import { UNKNOWN_ERROR } from '@/constants';

interface SliderState {
  loading: boolean;
  listSlider: [];
  error: string | null;
}

const initialState: SliderState = {
  loading: false,
  error: null,
  listSlider: [],
};

const sliderSlice = createSlice({
  name: 'slider',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSlider.pending, (state) => {
        state.loading = true;
        state.listSlider = [];
        state.error = null;
      })
      .addCase(getSlider.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.listSlider = action.payload?.data?.shops;
        state.error = null;
      })
      .addCase(getSlider.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.listSlider = [];
        state.error = action.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export default sliderSlice.reducer;
