/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCities, getDistricts, getWards, gHNExpressFee } from '@/services/ghnExpressServices';
import { UNKNOWN_ERROR } from '@/constants';

const initialState = {
  citiesLoading: false,
  districtsLoading: false,
  wardsLoading: false,
  shippingFeeLoading: false,
  error: null,
};

const ghnExpressSlice = createSlice({
  name: 'ghnExpress',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Get Cities
      .addCase(getCities.pending, (state) => {
        state.error = null;
        state.citiesLoading = true;
      })
      .addCase(getCities.fulfilled, (state) => {
        state.error = null;
        state.citiesLoading = false;
      })
      .addCase(getCities.rejected, (state, action: PayloadAction<any>) => {
        state.citiesLoading = false;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      })
      // Get Districts
      .addCase(getDistricts.pending, (state) => {
        state.error = null;
        state.districtsLoading = true;
      })
      .addCase(getDistricts.fulfilled, (state) => {
        state.error = null;
        state.districtsLoading = false;
      })
      .addCase(getDistricts.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload?.message || UNKNOWN_ERROR;
        state.districtsLoading = false;
      })
      // Get Wards
      .addCase(getWards.pending, (state) => {
        state.error = null;
        state.wardsLoading = true;
      })
      .addCase(getWards.fulfilled, (state) => {
        state.error = null;
        state.wardsLoading = false;
      })
      .addCase(getWards.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload?.message || UNKNOWN_ERROR;
        state.wardsLoading = false;
      })
      // GHN Express Fee
      .addCase(gHNExpressFee.pending, (state) => {
        state.error = null;
        state.shippingFeeLoading = true;
      })
      .addCase(gHNExpressFee.fulfilled, (state) => {
        state.error = null;
        state.shippingFeeLoading = false;
      })
      .addCase(gHNExpressFee.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload?.message || UNKNOWN_ERROR;
        state.shippingFeeLoading = false;
      });
  },
});

export default ghnExpressSlice.reducer;
