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
import RestaurantCard from '@/components/RestaurantCard';
import { RestaurantInfo } from '@/types';
import AppPagination from '@/components/AppPagination';
import ListSlider from '@/share/ListSlider';

export default function Home() {
  const t = useTranslations();
  const test: RestaurantInfo = {
    _id: '6752b96c51781eaa81340653',
    fullname: 'Xôi Chú Ngọng - Đê La Thành',
    email: 'nhucong03@gmail.com',
    phone: '',
    avatar:
      'https://food-cms.grab.com/compressed_webp/merchants/5-C4EKLZN2CBEUUE/hero/faff5dbaf7024a2c98f33303920f8ef1_1688956019240286277.webp',
    background:
      'https://food-cms.grab.com/compressed_webp/merchants/5-C4EKLZN2CBEUUE/hero/faff5dbaf7024a2c98f33303920f8ef1_1688956019240286277.webp',
    slug: 'nhu-cong',
    rating: 4.5,
  };

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
      <div style={{ width: '20%' }}>
        <RestaurantCard data={test} />
      </div>
      <AppPagination total={10} />
      <div className="container">
        <ListSlider />
      </div>
    </div>
  );
}
