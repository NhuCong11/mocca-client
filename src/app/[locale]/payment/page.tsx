'use client';
import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useTranslations } from 'next-intl';
import { getCookie } from 'typescript-cookie';

import styles from './Payment.module.scss';
import { UserInfo } from '@/types';
import { MOCCA } from '@/constants';
import { Link, useRouter } from '@/i18n/routing';
import { getVNCurrency, hostname } from '@/utils/constants';
import { getLocalStorageItem } from '@/utils/localStorage';
import { showToast, ToastType } from '@/utils/toastUtils';
import { useAppSelector } from '@/lib/hooks';

function Payment() {
  const t = useTranslations();
  const router = useRouter();

  const user: UserInfo | null = getLocalStorageItem('user');
  const payment = useAppSelector((state) => state.payment.payment);
  const isPayment = Object.keys(payment).length === 0;

  const [countDown, setCountDown] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  const secondsLeft = Math.max(Math.floor(countDown / 1000), 0);
  const minutesLeft = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    setIsClient(true);
    const expires = getCookie('expires');
    const currentTime = Date.now();

    if (expires) {
      const expirationTime = new Date(expires).getTime();
      setCountDown(Math.max(expirationTime - currentTime, 0));
    } else {
      setCountDown(15 * 60 * 1000);
    }
  }, []);

  useEffect(() => {
    if (getCookie('payment') && countDown > 0) {
      timerRef.current = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1000) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current!);
  }, [countDown]);

  useEffect(() => {
    if (!isPayment) return;

    showToast(t('checkout.notify03'), ToastType.WARNING);
  }, [isPayment, t]);

  useEffect(() => {
    if (!user?._id) return;

    socketRef.current = io(hostname, {
      query: { userId: user._id },
    });

    socketRef.current.on('paymentSuccess', () => {
      showToast(t('checkout.desc15'), ToastType.SUCCESS);
      router.push('/');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, t, router]);

  if (!isClient) return null;

  return (
    <div className={clsx(styles.payment)}>
      <div className={clsx(styles.payment__wrapper)}>
        <div className={clsx(styles.payment__logo)}>
          <Link href="/">
            <Image
              priority
              width={200}
              height={62}
              alt={MOCCA}
              src="/images/logo-vip1.png"
              className={clsx(styles.payment__logo_img)}
            />
          </Link>
        </div>
        <div className={clsx(styles.payment__content)}>
          <h1 className={clsx(styles.payment__title)}>{t('payment.title01')}</h1>
          <Image
            priority
            width={256}
            height={256}
            alt="QR"
            className={clsx(styles.payment__qr)}
            src={payment.qr || '/images/checkout/qr-payment.png'}
          />
          <p className={clsx(styles.payment__desc)}>
            {t('payment.desc01')} {getVNCurrency(payment.total)}
          </p>
          <p className={clsx(styles.payment__desc)}>
            {t('payment.desc02')}{' '}
            {!isPayment ? (
              <span className={clsx(styles.payment__times)}>
                {minutesLeft}:{seconds.toString().padStart(2, '0')}
              </span>
            ) : (
              15
            )}{' '}
            {t('payment.desc03')}.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
