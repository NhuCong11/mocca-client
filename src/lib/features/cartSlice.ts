/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addProductToCart, deleteProductFromCart, displayProductsInCart } from '@/services/cartServices';
import { ActionRejectedType } from '../store';
import { UNKNOWN_ERROR } from '@/constants';

interface CartState {
  loading: boolean;
  error: string | null;
  data: any;
  isAddProduct: boolean;
  isDeleteProduct: boolean;
}

const initialState: CartState = {
  loading: false,
  error: null,
  data: null,
  isAddProduct: false,
  isDeleteProduct: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Display products in cart
      .addCase(displayProductsInCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(displayProductsInCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(displayProductsInCart.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.error = action.payload?.message || UNKNOWN_ERROR;
        state.data = null;
      })
      // Add product to cart
      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAddProduct = false;
      })
      .addCase(addProductToCart.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isAddProduct = true;
      })
      .addCase(addProductToCart.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.error = action.payload?.message || UNKNOWN_ERROR;
        state.isAddProduct = false;
      })
      // Delete product from cart
      .addCase(deleteProductFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isDeleteProduct = false;
      })
      .addCase(deleteProductFromCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
        state.isDeleteProduct = true;
      })
      .addCase(deleteProductFromCart.rejected, (state, action: ActionRejectedType) => {
        state.loading = false;
        state.error = action.payload?.message || UNKNOWN_ERROR;
        state.isDeleteProduct = false;
      });
  },
});

export default cartSlice.reducer;
