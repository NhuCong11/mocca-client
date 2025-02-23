/* eslint-disable @typescript-eslint/no-explicit-any */
import { cancelOrder, createOrder, getOrder } from '@/services/ordersServices';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionRejectedType } from '../store';
import { UNKNOWN_ERROR } from '@/constants';

interface OrdersState {
  data: any;
  orders: any;
  error: string | null;
  loading: boolean;
  isOrder: boolean;
  idOrderCancel: null;
  cancelOrderLoading: boolean;
}

const initialState: OrdersState = {
  data: {},
  orders: null,
  error: null,
  loading: false,
  isOrder: false,
  idOrderCancel: null,
  cancelOrderLoading: false,
};

const ordersSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    deleteOrder: (state, action) => {
      state.idOrderCancel = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.data = {};
        state.isOrder = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.isOrder = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action: ActionRejectedType) => {
        state.data = {};
        state.isOrder = false;
        state.loading = false;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      })
      // Get Order
      .addCase(getOrder.pending, (state) => {
        state.orders = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getOrder.rejected, (state, action: ActionRejectedType) => {
        state.orders = null;
        state.loading = false;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.orders = null;
        state.cancelOrderLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.orders = action.payload;
        state.cancelOrderLoading = false;
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action: ActionRejectedType) => {
        state.orders = null;
        state.cancelOrderLoading = false;
        state.error = action.payload?.message || UNKNOWN_ERROR;
      });
  },
});

export const { deleteOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
