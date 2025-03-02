import { OrderItemInfo } from '@/types';
import { formatDateTime } from '@/utils/constants';
import { useTranslations } from 'next-intl';

export const getOrderStatus = (status: string | undefined, t: ReturnType<typeof useTranslations>) => {
  if (!status) return { status: '', color: '' };

  const statusMap: Record<string, { status: string; color: 'red' | 'green' }> = {
    pending: { status: t('historyOrder.statusPending'), color: 'green' },
    canceled: { status: t('historyOrder.statusCanceled'), color: 'red' },
    confirmed: { status: t('historyOrder.statusConfirmed'), color: 'green' },
    reject: { status: t('historyOrder.statusRejected'), color: 'red' },
    shipping: { status: t('historyOrder.statusShipping'), color: 'green' },
    success: { status: t('historyOrder.statusSuccess'), color: 'green' },
  };

  return statusMap[status] || { status: '', color: '' };
};

export const getPaymentMethod = (method: string | undefined, t: ReturnType<typeof useTranslations>) => {
  if (!method) return '';

  const methodMap: Record<string, string> = {
    cod: t('checkout.desc02'),
    bank: t('checkout.desc03'),
    prepaid: t('checkout.desc04'),
  };

  return methodMap[method] || '';
};

export const getPaymentStatus = (status: string | undefined, t: ReturnType<typeof useTranslations>) => {
  return status === 'unpaid' ? t('historyOrder.paymentStatus01') : t('historyOrder.paymentStatus02');
};

export const getOrderDetails = (data: OrderItemInfo, paymentMethod: string, paymentStatus: string) => [
  { label: 'historyOrder.label02', value: data?.address },
  { label: 'historyOrder.label03', value: data?.note },
  { label: 'historyOrder.label04', value: formatDateTime(data?.createdAt) },
  { label: 'checkout.title12', value: paymentMethod },
  {
    label: 'button.btn01',
    value: paymentStatus,
    className: data?.paymentStatus === 'unpaid' ? 'order-item__status--red' : '',
  },
];
