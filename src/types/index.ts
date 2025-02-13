export interface ButtonProps {
  to?: string;
  href?: string;
  primary?: boolean;
  outline?: boolean;
  large?: boolean;
  action?: boolean;
  checkout?: boolean;
  haveProducts?: boolean;
  disabled?: boolean;
  auth?: boolean;
  authGoogle?: boolean;
  more?: boolean;
  order?: boolean;
  cancel?: boolean;
  send?: boolean;
  shopAction?: boolean;
  nextPage?: boolean;
  pageNumber?: boolean;
  profileNavTitle?: boolean;
  profileNavItem?: boolean;
  changeProfile?: boolean;
  className?: string;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  mobile?: boolean;
  tabletLaptop?: boolean;
  [key: string]: boolean | string | React.ReactNode | (() => void) | undefined;
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
