export interface RejectValueError {
  rejectValue: { message: string };
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
