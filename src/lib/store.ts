import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import contactSlice from './features/contactSlice';
import sliderSlice from './features/sliderSlice';
import searchProductSlice from './features/searchProductSlice';
import categoriesSlice from './features/categoriesSlice';
import cartSlice from './features/cartSlice';
import checkoutCartsSlice from './features/checkoutCartsSlice';
import restaurantSlice from './features/restaurantSlice';
import ordersSlice from './features/ordersSlice';
import paymentSlice from './features/paymentSlice';
import ghnExpressSlice from './features/ghnExpressSlice';
interface MessagePayload {
  message: string;
  code?: number;
}

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      contact: contactSlice,
      slider: sliderSlice,
      searchProduct: searchProductSlice,
      categories: categoriesSlice,
      cart: cartSlice,
      checkoutCarts: checkoutCartsSlice,
      restaurant: restaurantSlice,
      orders: ordersSlice,
      payment: paymentSlice,
      ghn: ghnExpressSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type ActionRejectedType = PayloadAction<MessagePayload | undefined>;
