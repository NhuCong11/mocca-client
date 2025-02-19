import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import contactSlice from './features/contactSlice';
import sliderSlice from './features/sliderSlice';
import searchProductSlice from './features/searchProductSlice';
interface MessagePayload {
  message: string;
}

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      contact: contactSlice,
      slider: sliderSlice,
      searchProduct: searchProductSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type ActionRejectedType = PayloadAction<MessagePayload | undefined>;
