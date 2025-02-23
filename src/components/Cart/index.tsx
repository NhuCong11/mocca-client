/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { unwrapResult } from '@reduxjs/toolkit';
import { IconClock, IconX } from '@tabler/icons-react';

import styles from './Cart.module.scss';
import Button from '@/share/Button';
import Checkbox from '@/share/Checkbox';
import CartItem from '@/share/CartItem';
import { Link, usePathname } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import useSessionStorage from '@/hooks/useSessionStorage';
import { getLocalStorageItem } from '@/utils/localStorage';
import { deleteProductFromCart } from '@/services/cartServices';
import { saveSelectedShops } from '@/lib/features/checkoutCartsSlice';
import { CartInfo, CartItemInfo, CartsProps, CheckedItems } from '@/types';
import { showToast, ToastType } from '@/utils/toastUtils';
import { getVNCurrency } from '@/utils/constants';

const Cart: React.FC<CartsProps> = ({ showCart, handleCloseCart, data }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth.isLogin);
  const loading = useAppSelector((state) => state.cart.loading);
  const token = JSON.parse(String(getLocalStorageItem('accessToken')));
  const isProduct = data?.carts && data.carts.length > 0 ? true : false;
  const { setItem } = useSessionStorage();

  const [isClient, setIsClient] = useState(false);
  const [totalCartCheckout, setTotalCartCheckout] = useState(0);
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [checkedShops, setCheckedShops] = useState<Record<string, boolean>>({});

  const cartRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (cartRef.current) {
      cartRef.current.scrollTop += e.deltaY * 0.4;
    }
  };

  // Hàm xử lý khi checkbox của sản phẩm được thay đổi trạng thái
  const handleItemCheckboxChange = (shopId: string, itemId: string, isChecked: boolean) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [shopId]: {
        ...prevState[shopId],
        [itemId]: isChecked,
      },
    }));
  };

  // Hàm xử lý khi checkbox của cửa hàng được thay đổi trạng thái
  const handleShopCheckboxChange = (shopId: string, isChecked: boolean) => {
    const shopItems: Record<string, boolean> = {};
    data.carts.forEach((cartItem) => {
      if (cartItem.shop._id === shopId) {
        cartItem.cartDetails.forEach((cartDetail: CartItemInfo) => {
          shopItems[cartDetail._id] = isChecked;
        });
      }
    });
    setCheckedItems((prevState) => ({
      ...prevState,
      [shopId]: shopItems,
    }));
  };

  const handleClickShopName = (cartItem: CartInfo) => {
    setItem('restaurantIDSelected', cartItem.shop._id);
    setItem('restaurantSelected', { name: cartItem.shop?.fullname, slug: cartItem.shop?.slug });
    handleCloseCart();
  };

  const handleDeleteAll = async (cartDetails: CartItemInfo[]) => {
    if (!cartDetails) return;

    const deletePromises = cartDetails.map(async (cartDetail) => {
      const results = await dispatch(
        deleteProductFromCart({ product: cartDetail.product._id, quantity: cartDetail.quantity }),
      );
      return unwrapResult(results);
    });

    showToast(
      '',
      ToastType.PROMISE,
      Promise.all(deletePromises).then((results) => {
        const allSuccess = results.every((result) => result.code === 200);
        return allSuccess ? t('cart.notify01') : Promise.reject(new Error(t('cart.notify02')));
      }),
    );
  };

  useEffect(() => {
    if (data?.carts) {
      // Kiểm tra xem tất cả các sản phẩm của mỗi cửa hàng đã được chọn chưa
      const shopsChecked: Record<string, boolean> = {};
      data?.carts.forEach((cartItem) => {
        const shopId = cartItem.shop._id;
        if (shopId) {
          const shopItems = checkedItems[shopId] || {};
          const shopItemsChecked = Object.values(shopItems).every((item) => item);
          shopsChecked[shopId] = shopItemsChecked;
        }
      });
      setCheckedShops(shopsChecked);
    }
  }, [checkedItems, data?.carts]);

  useEffect(() => {
    const selectedShops: any[] = [];
    let totalMoney = 0;
    let totalMoneyCarts = 0;
    if (data?.carts) {
      data?.carts.forEach((cartItem) => {
        const shopId = cartItem.shop._id;
        const selectedProducts: CartItemInfo[] = [];
        if (shopId && checkedItems[shopId]) {
          cartItem.cartDetails.forEach((cartDetail) => {
            if (checkedItems[shopId][cartDetail._id]) {
              selectedProducts.push(cartDetail);
              totalMoney += cartDetail.totalPrice; // Thêm giá tiền của sản phẩm đã chọn vào tổng tiền
              totalMoneyCarts += cartDetail.totalPrice;
            }
          });
          if (selectedProducts.length > 0) {
            selectedShops.push({
              shop: cartItem.shop,
              selectedProducts: selectedProducts,
              totalMoney: totalMoney, // Thêm tổng tiền vào đối tượng selectedShops
            });
          }
        }
        totalMoney = 0;
      });
    }
    setTotalCartCheckout(totalMoneyCarts);

    if (selectedShops.length > 0) {
      dispatch(saveSelectedShops(selectedShops));
    } else {
      // dispatch(saveSelectedShops([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems, data?.carts]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className={clsx(styles['cart'], showCart && styles['cart--show'])}>
      <div className={clsx(styles['cart__top'])}>
        <button onClick={handleCloseCart} className={clsx(styles['cart__close'])}>
          <IconX />
        </button>
        {isProduct && (auth || token) && (
          <div className={clsx(styles['cart__top-block'])}>
            <h5 className={clsx(styles['cart__top-title'])}>{t('cart.title02')}</h5>
            <p className={clsx(styles['cart__top-desc'])}>
              <IconClock className={clsx(styles['cart__top-clock'])} />
              <span>
                {t('cart.desc01')} 2-3 {t('cart.desc05')}
              </span>
            </p>
          </div>
        )}
      </div>

      <div
        className={clsx(
          styles['cart__container'],
          (!isProduct || !auth || !token) && styles['cart__container--center'],
        )}
      >
        {!auth && !token && (
          <div className={clsx(styles['cart__empty'])}>
            <Image
              width={151}
              height={150}
              priority
              alt="cart"
              rel="prefetch"
              src={'/images/cart.svg'}
              className={clsx(styles['cart__empty-img'])}
            />
            <h5 className={clsx(styles['cart__empty-title'])}>{t('cart.title03')}</h5>
            <p className={clsx(styles['cart__empty-desc'])}>{t('cart.desc06')}</p>
            <Link href={'/auth/signin'}>
              <button className={clsx(styles['cart__empty-btn'])}>{t('button.btn05')}</button>
            </Link>
          </div>
        )}
        {!isProduct && !loading && (auth || token) && (
          <div className={clsx(styles['cart__empty'])}>
            <Image
              width={151}
              height={150}
              priority
              alt="cart"
              rel="prefetch"
              src={'/images/cart.svg'}
              className={clsx(styles['cart__empty-img'])}
            />
            <h5 className={clsx(styles['cart__empty-title'])}>{t('cart.title01')}</h5>
            <p className={clsx(styles['cart__empty-desc'])}>{t('cart.desc02')}</p>
            <button onClick={handleCloseCart} className={clsx(styles['cart__empty-btn'])}>
              {t('button.btn02')}
            </button>
          </div>
        )}

        {loading && pathname !== '/checkout' && (
          <div className={clsx(styles['cart__empty'], styles['cart__loading'])}>
            <Loader size={50} color="var(--primary-bg)" />
          </div>
        )}

        {isProduct && (auth || token) && (
          <div ref={cartRef} onWheel={handleWheel} className={clsx(styles['cart__scroll'])}>
            <div className={clsx(styles['cart__content'])}>
              {data.carts.map((cartItem, index) => {
                return (
                  <div key={index} className={clsx(styles['cart__products'])}>
                    <div className={clsx(styles['cart__products-top'])}>
                      <div className={clsx(styles['cart__products-name'])}>
                        <Checkbox
                          mr={15}
                          checked={(cartItem.shop._id && checkedShops[cartItem.shop._id]) || false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (cartItem.shop._id) handleShopCheckboxChange(cartItem.shop._id, e.target.checked);
                          }}
                        />

                        <Link href={`/restaurants/${cartItem.shop.slug}`} onClick={() => handleClickShopName(cartItem)}>
                          <h5 className={clsx(styles['cart__products-heading'])}>{cartItem.shop.fullname}</h5>
                        </Link>
                      </div>
                      <button
                        onClick={() => handleDeleteAll(cartItem.cartDetails)}
                        className={clsx(styles['cart__products-deletes'])}
                      >
                        {t('button.btn04')}
                      </button>
                    </div>
                    <div className={clsx(styles['cart__products-list'])}>
                      {cartItem.cartDetails.map((cartDetail, index: number) => {
                        return (
                          <CartItem
                            key={index}
                            data={cartDetail}
                            showCart={showCart}
                            shopChecked={(cartItem.shop._id && checkedShops[cartItem.shop._id]) || false}
                            onItemCheckboxChange={(itemId, isChecked) => {
                              if (cartItem.shop._id) handleItemCheckboxChange(cartItem.shop._id, itemId, isChecked);
                            }}
                            checkedItems={checkedItems}
                            idShop={cartItem.shop._id}
                          />
                        );
                      })}
                    </div>
                    <div className={clsx(styles['cart__summary'])}>
                      <div className={clsx(styles['cart__summary-info'])}>
                        <span className={clsx(styles['cart__summary-price'])}>{t('cart.desc03')}</span>
                        <span className={clsx(styles['cart__summary-price'])}>
                          {getVNCurrency(cartItem.totalMoney)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className={clsx(styles['cart__summary'])}>
                <p className={clsx(styles['cart__summary-desc'])}>{t('cart.desc04')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {isProduct && (auth || token) && (
        <div className={clsx(styles['cart__bottom'])}>
          <div className={clsx(styles['cart__bottom-info'])}>
            <span className={clsx(styles['cart__bottom-price'])}>{t('cart.desc03')}</span>
            <span className={clsx(styles['cart__bottom-price'])}>{getVNCurrency(totalCartCheckout)}</span>
          </div>
          <Link
            href={totalCartCheckout !== 0 ? '/checkout' : ''}
            style={totalCartCheckout === 0 ? { cursor: 'no-drop' } : {}}
          >
            <Button
              checkout
              primary
              disabled={totalCartCheckout === 0}
              onClick={() => {
                handleCloseCart();
              }}
            >
              {t('button.btn01')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
