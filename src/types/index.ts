import { Socket } from 'socket.io-client';

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
  classifies?: string[];
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
  classify?: string;
}

export interface CartItemInfo {
  _id: string;
  product: ProductInfo;
  quantity: number;
  totalPrice: number;
  classify?: string;
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

export interface RestaurantsInfo {
  shops: RestaurantInfo[];
  limit: number;
  totalResult: number;
  totalPage: number;
  currentPage: number;
  currentResult: number;
}

export interface CreateOrderInfo {
  cartDetails: string[];
  paymentMethod: string;
  address: string;
  note: string;
}

export interface GetOrderInfo {
  limit: number;
  page: number;
  status?: string;
}

export interface GHNServicesProps {
  serviceID: number;
  price: number;
  from_district_id: number;
  to_district_id: number;
  to_ward_code: string;
  height: number;
  length: number;
  weight: number;
  width: number;
}

export interface CheckoutCartsData {
  shop: RestaurantInfo;
  selectedProducts: CartItemInfo[];
  totalMoney: number;
}

export interface AddressItemInfo {
  NameExtension: string[];
  ProvinceName?: string;
  ProvinceID?: number;
  DistrictName?: string;
  DistrictID?: number;
  WardName?: string;
  WardCode?: string;
}

export interface ChangePasswordInfo {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UpdateSecretKeyProps {
  code: string;
  secret: string;
}

export interface OrderInfo {
  currentPage: number;
  currentResult: number;
  limit: number;
  orders: OrderItemInfo[];
  totalPage: number;
  totalResult: number;
}

export interface OrderItemInfo {
  _id: string;
  createdAt: string;
  updatedAt: string;
  totalMoney: number;
  status: string;
  shop: RestaurantInfo;
  paymentMethod: string;
  paymentCode: string;
  paymentStatus?: string;
  cartDetails: CartItemInfo[];
  address: string;
  note: string;
  expriedTimeBank?: string;
}

export interface MessageItemInfo {
  _id: string;
  senderId: string;
  receiverId: string;
  image?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMessagesProps {
  userID: string;
  conversationID: string;
}

export interface SendMessageProps {
  message: string | undefined;
  conversationID: string;
  image: File | null;
}

export interface ChatMessageContextType {
  openMessage: boolean;
  openMessageModal: () => void;
  closeMessageModal: () => void;
  newConversation: RestaurantInfo | undefined;
  addConversation: (newConversation: RestaurantInfo) => void;
}

export interface SocketMessageType {
  socket: Socket | null;
  onlineUsers: RestaurantInfo[];
}

export interface ChatMessageForm {
  shop?: string;
  message?: string;
}
