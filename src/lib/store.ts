import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
interface MessagePayload {
  message: string;
}

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type ActionRejectedType = PayloadAction<MessagePayload | undefined>;
