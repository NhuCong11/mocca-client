/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRestaurantDetail, getRestaurants, getRestaurantsByCategory } from '@/services/restaurantServices';
import { ActionRejectedType } from '../store';
import { UNKNOWN_ERROR } from '@/constants';
import { RestaurantInfo, RestaurantsInfo } from '@/types';

interface RestaurantState {
  restaurants: RestaurantsInfo | null;
  loading: boolean;
  error: string | null;
  length: number;
  restaurantDetail: RestaurantInfo | null;
}

const initialState: RestaurantState = {
  restaurants: null,
  loading: false,
  error: null,
  length: 0,
  restaurantDetail: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      //Get Restaurants
      .addCase(getRestaurants.pending, (state) => {
        state.loading = true;
        state.restaurants = null;
        state.length = 0;
        state.error = null;
      })
      .addCase(getRestaurants.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.restaurants = action.payload?.data;
        state.length = action.payload.data?.totalResult;
        state.error = null;
      })
      .addCase(getRestaurants.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.restaurants = null;
        state.length = 0;
        state.error = action?.payload?.message || UNKNOWN_ERROR;
      })
      //Get Restaurants by category
      .addCase(getRestaurantsByCategory.pending, (state) => {
        state.loading = true;
        state.restaurants = null;
        state.length = 0;
        state.error = null;
      })
      .addCase(getRestaurantsByCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.restaurants = action.payload?.data;
        state.length = action.payload?.data?.totalResult;
        state.error = null;
      })
      .addCase(getRestaurantsByCategory.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.restaurants = null;
        state.length = 0;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      })
      //Get restaurant detail
      .addCase(getRestaurantDetail.pending, (state) => {
        state.loading = true;
        state.restaurantDetail = null;
        state.error = null;
      })
      .addCase(getRestaurantDetail.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.restaurantDetail = action.payload?.data?.shop;
        state.error = null;
      })
      .addCase(getRestaurantDetail.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.restaurantDetail = null;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export default restaurantSlice.reducer;
