/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import styles from '../scss/Profile.module.scss';
import { statusList } from '../constant';
import Skeleton from '@/share/Skeleton';
import { OrderItemInfo } from '@/types';
import { getOrder } from '@/services/ordersServices';
import AppPagination from '@/components/AppPagination';
import OrderHistoryItem from '@/share/OrderHistoryItem';
import { showToast, ToastType } from '@/utils/toastUtils';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useQueryParams } from '@/hooks/useQueryParams';

function OrderHistory() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { getParam, updateParams } = useQueryParams();
  const pageParam = Number(getParam('page')) || 1;
  const reduxData = useAppSelector((state) => state.orders);

  const [orderData, setOrderData] = useState([]);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(statusList[0].status);
  const [statusSelected, setStatusSelected] = useState(statusList[0].label);

  const fetchOrderData = () => {
    dispatch(getOrder({ limit: 10, page: currentPage, status: status === 'all' ? '' : status })).then((result) => {
      if (result.payload?.code === 200) {
        setOrderData(result.payload?.data?.orders);
        setTotalPages(result.payload?.data?.totalPage);
      } else {
        showToast(result?.payload.message || t('system.error'), ToastType.ERROR);
      }
    });
  };

  const handleSelectStatus = (status: string) => {
    setCurrentPage(1);
    setStatus(status);
    setOrderData([]);
  };

  useEffect(() => {
    const newList = orderData.filter((item: OrderItemInfo) => item._id !== reduxData?.idOrderCancel);
    setOrderData(newList);
  }, [reduxData?.idOrderCancel]);

  useEffect(() => {
    setOrderData([]);
    window.scrollTo(0, 0);
    fetchOrderData();
  }, [status, currentPage]);

  useEffect(() => {
    updateParams({ page: String(currentPage) });
  }, []);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  return (
    <div className={clsx(styles['history-order'])}>
      <div className={clsx(styles['history-order__status'])}>
        {statusList.map((item, index) => {
          return (
            <h4
              className={clsx(
                styles['history-order__status-item'],
                statusSelected === item.label && styles['history-order__status--active'],
              )}
              key={index}
              onClick={() => {
                if (statusSelected === item.label) {
                  return;
                }
                setStatusSelected(item.label);
                handleSelectStatus(item.status);
              }}
            >
              {t(item.label)}
            </h4>
          );
        })}
      </div>

      <div className={clsx(styles['history-order__list'])}>
        {orderData &&
          !reduxData?.cancelOrderLoading &&
          orderData?.map((order, index) => {
            return <OrderHistoryItem key={index} data={order} />;
          })}
      </div>

      {(reduxData?.loading || reduxData?.cancelOrderLoading) && <Skeleton quantity={9} />}

      {orderData.length === 0 && !reduxData?.loading && (
        <div className={clsx(styles['empty-order'])}>
          <Image
            width={206}
            height={212}
            priority
            alt="Empty order"
            src={'/images/empty-order.png'}
            className={clsx(styles['empty-order__img'])}
          />
          <p className={clsx(styles['empty-order__desc'])}>{t('historyOrder.desc01')}</p>
        </div>
      )}

      <AppPagination total={totalPages} />
    </div>
  );
}

export default OrderHistory;
