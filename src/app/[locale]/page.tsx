'use client';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import styles from '@/styles/Home.module.scss';
import Banner from '@/components/Banner';
import { Link } from '@/i18n/routing';
import Breadcrumb from '@/share/Breadcrumb';
import Button from '@/share/Button';
import Checkbox from '@/share/Checkbox';
import NoResult from '@/share/NoResult';
import DefaultSkeleton from '@/share/Skeleton';

export default function Home() {
  const t = useTranslations();

  return (
    <div className={clsx(styles['home'])}>
      <Banner />
      <h1 data-aos="zoom-in-right">{t('title')}</h1>
      <Link href="/checkout">Checkout</Link>
      <Button primary onClick={() => console.log('oke')}>
        Abc
      </Button>
      <Checkbox />
      <Breadcrumb listData={[{ title: 'Checkout', href: '/checkout' }]} />
      <DefaultSkeleton />
      <NoResult />
    </div>
  );
}
