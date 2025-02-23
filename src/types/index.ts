export interface RejectValueError {
  rejectValue: { message: string };
}

export interface DefaultParams {
  limit: number;
  page: number;
  keyword?: string;
}

export interface UserInfo {
  _id?: string;
  fullname?: string;
  email?: string;
  normalizedEmail?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  isVerify?: boolean;
  verifyExpireAt?: string;
  forgotStatus?: string;
  role?: string;
  avatar?: string;
  background?: string;
  is2FA?: boolean;
  phone?: string;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
  secret?: string;
  username?: string;
  accountBalance?: number;
}

export interface ProductInfo {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  shop?: RestaurantInfo;
  category?: CategoryInfo;
}

export interface CategoryInfo {
  _id: string;
  name: string;
  image: string;
  slug: string;
  products?: ProductInfo[];
}

export interface RestaurantInfo {
  _id?: string;
  fullname?: string;
  email?: string;
  normalizedEmail?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  isVerify?: boolean;
  verifyExpireAt?: string;
  forgotStatus?: string;
  role?: string;
  avatar?: string;
  background?: string;
  is2FA?: boolean;
  phone?: string;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
  secret?: string;
  slug: string;
  description?: string;
  rating?: number;
  categories?: CategoryInfo[];
}

export interface ChangeCartInfo {
  product?: string;
  quantity?: number;
}

export interface CartItemInfo {
  _id: string;
  product: ProductInfo;
  quantity: number;
  totalPrice: number;
}

export interface CartInfo {
  shop: RestaurantInfo;
  cartDetails: CartItemInfo[];
  totalMoney: number;
}

export interface CartsInfo {
  carts: CartInfo[];
  totalProducts: number;
  totalMoneyAllCarts: number;
}

export interface CartsProps {
  showCart: boolean;
  handleCloseCart: () => void;
  data: CartsInfo;
}

export interface CheckedItems {
  [shopId: string]: {
    [itemId: string]: boolean;
  };
}
