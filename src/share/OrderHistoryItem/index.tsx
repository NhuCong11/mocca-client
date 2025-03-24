import Image from 'next/image';
import clsx from 'clsx';
import { Divider } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { getCookie } from 'typescript-cookie';
import { IconBrandAppgallery } from '@tabler/icons-react';

import styles from './OrderHistoryItem.module.scss';
import Button from '@/share/Button';
import { MOCCA } from '@/constants';
import { useRouter } from '@/i18n/routing';
import { useAppDispatch } from '@/lib/hooks';
import { cancelOrder } from '@/services/ordersServices';
import { addProductToCart } from '@/services/cartServices';
import { deleteOrder as cancel } from '@/lib/features/ordersSlice';
import { CartItemInfo, OrderItemInfo } from '@/types';
import { getVNCurrency } from '@/utils/constants';
import { showToast, ToastType } from '@/utils/toastUtils';
import { getOrderDetails, getOrderStatus, getPaymentMethod, getPaymentStatus } from './constant';

function OrderHistoryItem({ data }: { data: OrderItemInfo }) {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleCancelOrder = () => {
    const cancelOrderPromise = dispatch(cancelOrder(data?._id))
      .then((result) => {
        if (result.payload?.code === 200) {
          dispatch(cancel(data?._id));
          return result.payload?.message;
        } else {
          throw new Error(result?.payload.message || t('system.error'));
        }
      })
      .catch((err) => {
        throw new Error(err?.message || t('system.error'));
      });
    showToast('', ToastType.PROMISE, cancelOrderPromise);
  };

  const handleRepurchase = async () => {
    try {
      const promises = data.cartDetails.map((product: CartItemInfo) => {
        return dispatch(addProductToCart({ product: product.product._id, quantity: product.quantity }));
      });
      await Promise.all(promises);
      showToast(t('historyOrder.notify01'), ToastType.SUCCESS);
    } catch (error) {
      showToast(`${t('historyOrder.notify02')}: ${error}`, ToastType.ERROR);
    }
  };

  const orderStatus = getOrderStatus(data?.status, t);
  const paymentMethod = getPaymentMethod(data?.paymentMethod, t);
  const paymentStatus = getPaymentStatus(data?.paymentStatus, t);
  const orderDetails = getOrderDetails(data, paymentMethod, paymentStatus);

  return (
    <div className={clsx(styles['order-item'])}>
      <div className={clsx(styles['order-item__shop'])}>
        <div className={clsx(styles['order-item__shop-name'])}>
          <IconBrandAppgallery />
          <h4>{data?.shop.fullname}</h4>
        </div>

        <p
          className={clsx(
            styles['order-item__status'],
            orderStatus?.color === 'red' && styles['order-item__status--red'],
          )}
        >
          {orderStatus?.status}
        </p>
      </div>
      <Divider variant="dashed" />

      {data?.cartDetails.map((cartDetail: CartItemInfo, index: number) => {
        return (
          <div key={index} className={clsx(styles['order-item__info'])}>
            <Image
              priority
              alt={MOCCA}
              width={256}
              height={256}
              className={clsx(styles['order-item__info-img'])}
              src={cartDetail.product.image}
            />

            <div className={clsx(styles['order-item__info-group'])}>
              <h4 className={clsx(styles['order-item__info-name'])}>{cartDetail.product.name}</h4>
              <p className={clsx(styles['order-item__info-desc'])}>{cartDetail.product.description}</p>
              <span
                className={clsx(styles['order-item__info-quantity'])}
              >{`X ${cartDetail.quantity} | ${cartDetail.classify}`}</span>
            </div>

            <span className={clsx(styles['order-item__info-price'])}>{getVNCurrency(cartDetail.product.price)}</span>
          </div>
        );
      })}
      <Divider variant="dashed" />

      {orderDetails.map((detail, index) => (
        <div key={index} className={clsx(styles['details'])}>
          <span className={clsx(styles['details__label'])}>{t(detail.label)}</span>
          <p className={clsx(styles['details__value'], styles[detail.className ?? ''])}>{detail.value}</p>
        </div>
      ))}

      <div className={clsx(styles['total'])}>
        <div className={clsx(styles['total__content'])}>
          <span className={clsx(styles['total__label'])}>{t('historyOrder.label01')}</span>
          <span className={clsx(styles['total__value'])}>{getVNCurrency(data?.totalMoney)}</span>
        </div>

        <div className={clsx(styles['total__buttons'])}>
          <Button
            onClick={() => {
              if (data?.status === 'pending') {
                handleCancelOrder();
              } else {
                handleRepurchase();
              }
            }}
            className={clsx(styles['total__btn'])}
            order
            primary
            cancel={data?.status === 'pending'}
          >
            {data?.status === 'pending' ? t('profile.btn-cancel') : t('button.btn18')}
          </Button>

          {data?.status === 'pending' &&
            data?.paymentMethod === 'bank' &&
            data?.paymentStatus === 'unpaid' &&
            getCookie('payment') && (
              <Button order primary className={clsx(styles['total__btn'])} onClick={() => router.push('/payment')}>
                {t('button.btn01')}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryItem;
