/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryInfo } from '@/types';
import { getCategories } from '@/services/categoriesServices';
import { ActionRejectedType } from '../store';
import { UNKNOWN_ERROR } from '@/constants';

interface CategoriesData {
  categories: CategoryInfo[];
  limit: number;
  totalResult: number;
  totalPage: number;
  currentPage: number;
  currentResult: number;
}

interface CategoriesState {
  data: CategoriesData | null;
  loading: boolean;
  error: string | null;
  listCategories: CategoryInfo[];
}

const initialState: CategoriesState = {
  data: null,
  listCategories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCategories.pending, (state) => {
        state.data = null;
        state.listCategories = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action?.payload;
        state.listCategories = action?.payload?.data?.categories;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action: ActionRejectedType) => {
        state.data = null;
        state.listCategories = [];
        state.loading = false;
        state.error = action?.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export default categoriesSlice.reducer;
