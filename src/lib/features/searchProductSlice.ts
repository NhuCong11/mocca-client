/* eslint-disable @typescript-eslint/no-explicit-any */
import { searchProduct } from '@/services/searchProductServices';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionRejectedType } from '../store';
import { UNKNOWN_ERROR } from '@/constants';

export interface SearchProductState {
  loading: boolean;
  products: [];
  data: null;
  error: string | null;
  totalPage: number;
  product: null;
}

const initialState: SearchProductState = {
  loading: false,
  products: [],
  data: null,
  error: null,
  totalPage: 0,
  product: null,
};

const searchProductSlice = createSlice({
  name: 'search-product',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(searchProduct.pending, (state) => {
        state.loading = true;
        state.products = [];
        state.data = null;
        state.totalPage = 0;
        state.error = null;
      })
      .addCase(searchProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.products = action.payload?.data?.products;
        state.data = action?.payload;
        state.totalPage = action.payload?.data?.totalPage;
        state.error = null;
      })
      .addCase(searchProduct.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.products = [];
        state.data = null;
        state.totalPage = 0;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export default searchProductSlice.reducer;
