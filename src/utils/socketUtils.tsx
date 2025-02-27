import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { hostname, getVNCurrency } from '@/utils/constants';
import { showToast, ToastType } from '@/utils/toastUtils';
import { useTranslations } from 'next-intl';

export function useSocketWallet(userId: string) {
  const t = useTranslations();

  useEffect(() => {
    const socket: Socket = io(hostname, { query: { userId } });

    socket.on('rechargeSuccess', (data) => {
      showToast(`${t('topUp.desc06')} ${getVNCurrency(data.amount)}`, ToastType.SUCCESS);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, t]);
}
