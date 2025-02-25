/* eslint-disable @typescript-eslint/no-explicit-any */
import getExpirationTime from '@/hooks/useExpirationTime';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookie, setCookie } from 'typescript-cookie';

const getPaymentFromCookie = (): any => {
  if (typeof window === 'undefined') {
    return {};
  }
  const payment = getCookie('payment');
  return payment ? JSON.parse(payment) : {};
};

const initialState = {
  payment: getPaymentFromCookie(),
};

const paymentReducer = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    savePayment: (state, action: PayloadAction<any>) => {
      state.payment = action.payload;
      setCookie('payment', JSON.stringify(action.payload), {
        expires: getExpirationTime(15),
        path: '/',
        secure: true,
        sameSite: 'Strict',
      });
      setCookie('expires', getExpirationTime(15).toISOString(), {
        expires: getExpirationTime(15),
        path: '/',
        secure: true,
        sameSite: 'Strict',
      });
    },
  },
});

export const { savePayment } = paymentReducer.actions;
export default paymentReducer.reducer;
