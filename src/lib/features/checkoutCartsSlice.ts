import { CartItemInfo, RestaurantInfo } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  selectedShops: Array<{
    shop: RestaurantInfo;
    selectedProducts: CartItemInfo[];
    totalMoney: number;
  }>;
}

const initialState: InitialState = {
  selectedShops: [],
};

const checkoutCartsReducer = createSlice({
  name: 'checkoutCarts',
  initialState,
  reducers: {
    saveSelectedShops: (state, action) => {
      state.selectedShops = action.payload;
    },
    updateProductQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      for (const shop of state.selectedShops) {
        const productItem = shop.selectedProducts.find((p) => p.product._id === productId);
        if (productItem) {
          productItem.quantity = quantity;
          productItem.totalPrice = quantity * productItem.product.price;
          break;
        }
      }
    },
    deleteCheckoutProduct: (state, action) => {
      const { productId } = action.payload;
      for (const shop of state.selectedShops) {
        shop.selectedProducts = shop.selectedProducts.filter((p) => p.product._id !== productId);
      }
      state.selectedShops = state.selectedShops.filter((shop) => shop.selectedProducts.length > 0);
    },
  },
});

export const { saveSelectedShops, updateProductQuantity, deleteCheckoutProduct } = checkoutCartsReducer.actions;
export default checkoutCartsReducer.reducer;
