import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';

import styles from './CartItem.module.scss';
import Button from '@/share/Button';
import Checkbox from '@/share/Checkbox';
import { usePathname } from '@/i18n/routing';
import { getVNCurrency } from '@/utils/constants';
import { CartItemInfo, ChangeCartInfo } from '@/types';
import { showToast, ToastType } from '@/utils/toastUtils';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addProductToCart, deleteProductFromCart } from '@/services/cartServices';

interface CartItemProps {
  key: number;
  data: CartItemInfo;
  isCheckout?: boolean;
  showCart?: boolean;
  shopChecked?: boolean;
  onItemCheckboxChange?: (itemId: string, isChecked: boolean) => void;
  checkedItems?: Record<string, Record<string, boolean>>;
  idShop?: string;
}

const CartItem: React.FC<CartItemProps> = ({
  data,
  isCheckout = false,
  showCart,
  shopChecked = false,
  onItemCheckboxChange,
  checkedItems,
  idShop,
}) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const checkoutCartsData = useAppSelector((state) => state.checkoutCarts.selectedShops);

  const [openChange, setOpenChange] = useState<boolean>(false);
  const [isNotUpdate, setIsNotUpdate] = useState<boolean>(false);
  const [changeQuantity, setChangeQuantity] = useState<number>(data.quantity);
  const [changeTotalPrice, setChangeTotalPrice] = useState<number>(data?.totalPrice);

  const [isChecked, setIsChecked] = useState<boolean>(true);

  const productName = data?.product?.name;

  const temporaryIncreasedQuantity = () => {
    setChangeQuantity((preQuantity: number) => preQuantity + 1);
    setChangeTotalPrice((changeQuantity + 1) * data.product.price);
  };

  const temporaryReducedQuantity = () => {
    if (changeQuantity > 0) {
      setChangeQuantity((preQuantity: number) => preQuantity - 1);
      setChangeTotalPrice((changeQuantity - 1) * data.product.price);
    }
  };

  const handleUpdateQuantity = () => {
    if (changeQuantity > data.quantity) {
      const addProductPromise = dispatch(
        addProductToCart({ product: data.product._id, quantity: changeQuantity - data.quantity }),
      )
        .then((result) => {
          if (result?.payload?.code === 200) {
            return result?.payload?.message;
          } else {
            throw new Error(result?.payload?.message || t('system.error'));
          }
        })
        .catch((err) => {
          throw new Error(err?.message || t('system.error'));
        });
      showToast('', ToastType.PROMISE, addProductPromise);
    } else {
      const deleteProductPromise = dispatch(
        deleteProductFromCart({ product: data.product._id, quantity: data.quantity - changeQuantity }),
      )
        .then((result) => {
          if (result?.payload?.code === 200) {
            return result?.payload?.message;
          } else {
            throw new Error(result?.payload?.message || t('system.error'));
          }
        })
        .catch((err) => {
          throw new Error(err?.message || t('system.error'));
        });
      showToast('', ToastType.PROMISE, deleteProductPromise);
    }
  };

  const deleteProduct = (data: ChangeCartInfo) => {
    const deletePromise = dispatch(deleteProductFromCart(data))
      .then((result) => {
        if (result.payload.code === 200) {
          return result?.payload?.message;
        } else {
          throw new Error(result?.payload?.message || t('system.error'));
        }
      })
      .catch((err) => {
        throw new Error(err?.message || t('system.error'));
      });
    showToast('', ToastType.PROMISE, deletePromise);
  };

  useEffect(() => {
    if (isNotUpdate) {
      setChangeQuantity(data?.quantity);
      setIsNotUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNotUpdate]);

  useEffect(() => {
    if (!showCart) {
      setOpenChange(false);
    }
  }, [showCart]);

  useEffect(() => {
    setIsChecked(shopChecked);
  }, [shopChecked]);

  useEffect(() => {
    if (data && pathname !== '/checkout') {
      onItemCheckboxChange?.(String(data._id), true);
    }
    if (checkoutCartsData.length === 0) {
      onItemCheckboxChange?.(String(data._id), false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openChange) {
      setChangeQuantity(data?.quantity);
    }
    setChangeTotalPrice(data?.totalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openChange]);

  return (
    <div className={clsx(styles['product'])}>
      {!isCheckout && (
        <Checkbox
          mr={15}
          checked={
            isChecked ||
            (data?._id && checkedItems?.[String(idShop)] ? checkedItems?.[String(idShop)][String(data._id)] : true)
          }
          onChange={(e) => {
            setIsChecked(e.target.checked);
            onItemCheckboxChange?.(String(data._id), e.target.checked);
          }}
        />
      )}
      <div className={clsx(styles['product__quantity'])}>
        <button
          style={isCheckout ? { cursor: 'default' } : {}}
          onClick={() => {
            if (!isCheckout) {
              setOpenChange(!openChange);
            }
          }}
          className={clsx(styles['product__quantity-btn'])}
        >
          {data?.quantity} X
        </button>
      </div>

      <div className={clsx(styles['product__img'])}>
        <Image
          rel="prefetch"
          width={256}
          height={256}
          priority
          src={data?.product?.image || '/images/default-img.png'}
          alt="Product Image"
          className={clsx(styles['product__img-thumb'])}
        />
      </div>

      <div className={clsx(styles['product__detail'])}>
        <p className={clsx(styles['product__detail-name'])}>{productName}</p>

        <div className={clsx(styles['product__detail-group'])}>
          <span className={clsx(styles['product__detail-price'])}>{getVNCurrency(data?.product?.price)}</span>
          {!isCheckout && (
            <button
              onClick={() => {
                deleteProduct({ product: data.product._id, quantity: data.quantity });
              }}
              className={clsx(styles['product__detail-delete'])}
            >
              {t('button.btn19')}
            </button>
          )}
        </div>
      </div>

      <div className={clsx(styles['change-quantity'], openChange && styles['change-quantity--show'])}>
        <button
          onClick={() => {
            setOpenChange(false);
            setIsNotUpdate(true);
          }}
          className={clsx(styles['change-quantity__close'])}
        >
          <IconX />
        </button>

        <Image
          width={516}
          height={516}
          rel="prefetch"
          priority
          src={data?.product?.image || '/images/default-img.png'}
          className={clsx(styles['change-quantity__img'])}
          alt="Product Preview"
        />

        <div className={clsx(styles['change-quantity__first'])}>
          <h1 className={clsx(styles['change-quantity__name'])}>{productName}</h1>
          <p className={clsx(styles['change-quantity__desc'])}>{productName}</p>
          <p className={clsx(styles['change-quantity__price'])}>{getVNCurrency(changeTotalPrice)}</p>
        </div>

        <div className={clsx(styles['change-quantity__last'])}>
          <h2 className={clsx(styles['change-quantity__title'])}>{t('cart.title04')}</h2>
          <div className={clsx(styles['change-quantity__btns'])}>
            <button onClick={temporaryReducedQuantity} className={clsx(styles['change-quantity__btn'])}>
              <IconMinus />
            </button>
            <span className={clsx(styles['change-quantity__number'])}>{changeQuantity}</span>
            <button onClick={temporaryIncreasedQuantity} className={clsx(styles['change-quantity__btn'])}>
              <IconPlus />
            </button>
          </div>
        </div>
        <div className={clsx(styles['change-quantity__footer'])}>
          <div
            onClick={() => {
              handleUpdateQuantity();
              setOpenChange(false);
            }}
          >
            <Button checkout primary>
              {t('button.btn26')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
