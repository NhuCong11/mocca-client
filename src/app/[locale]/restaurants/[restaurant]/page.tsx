'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Rating, Tooltip } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';

import styles from './Restaurant.module.scss';
import NoResult from '@/share/NoResult';
import LoadingStart from '@/share/Loading';
import { useRouter } from '@/i18n/routing';
import Breadcrumb from '@/share/Breadcrumb';
import ProductCard from '@/share/ProductCard';
import { CategoryInfo, ProductInfo } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getRestaurantDetail } from '@/services/restaurantServices';

function RestaurantDetail() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const reduxData = useAppSelector((state) => state.restaurant);
  const [activeCategory, setActiveCategory] = useState('');
  const [restaurantInfo, setRestaurantInfo] = useState<{ name?: string; slug?: string }>({});

  const handleModal = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/signin');
    }
  };

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top - 100, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      reduxData?.restaurantDetail?.categories?.forEach((category) => {
        const categoryElement = document.getElementById(category._id);
        if (categoryElement) {
          const categoryPosition = categoryElement.getBoundingClientRect().top;
          if (categoryPosition < window.innerHeight / 2 && categoryPosition > -categoryElement.offsetHeight / 2) {
            setActiveCategory(category._id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduxData.restaurantDetail]);

  useEffect(() => {
    const restaurantId = sessionStorage.getItem('restaurantIDSelected');
    if (restaurantId) {
      dispatch(getRestaurantDetail(JSON.parse(restaurantId))).then((result) => {
        if (result?.payload?.code === 200) {
          setActiveCategory(result.payload.data.shop?.categories?.[0]?._id || '');
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    const storedRestaurant = sessionStorage.getItem('restaurantSelected');
    if (storedRestaurant) {
      setRestaurantInfo(JSON.parse(storedRestaurant));
    }
  }, []);

  return (
    <div className={clsx(styles['restaurant'])}>
      <div className={clsx(styles['restaurant__header'])}>
        <Image
          width={480}
          height={270}
          priority
          className={clsx(styles['restaurant__bg'])}
          src={reduxData?.restaurantDetail?.background || '/images/default-img.png'}
          alt={reduxData?.restaurantDetail?.fullname || 'Restaurant Background'}
        />

        <div className={clsx('container gx-5')}>
          <Breadcrumb
            listData={[
              { title: t('restaurant.heading01'), href: '/restaurants' },
              { title: String(restaurantInfo?.name) },
            ]}
          />

          <h1 className={clsx(styles['restaurant__name'])}>
            {reduxData?.restaurantDetail?.fullname}
            <span className={clsx(styles['restaurant__chat'])} onClick={handleModal}>
              <Tooltip label={<span style={{ fontSize: '1.3rem' }}>Chat Message</span>} withArrow>
                <IconMessage size={30} />
              </Tooltip>
            </span>
          </h1>
          <p className={clsx(styles['restaurant__desc'])}>{reduxData?.restaurantDetail?.description}</p>

          <div className={clsx(styles['restaurant__rating'])}>
            <span>{reduxData?.restaurantDetail?.rating}</span>
            <Rating value={reduxData.restaurantDetail?.rating || 0} fractions={2} size="lg" readOnly />
            <span>Reviews</span>
          </div>

          <div className={clsx(styles['restaurant__time'])}>
            <span className={clsx(styles['restaurant__time-label'])}>{t('restaurant-detail.open-time-label')}</span>
            <span className={clsx(styles['restaurant__time-value'])}>{t('restaurant-detail.open-time-value')}</span>
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className={clsx(styles['restaurant__nav'])}>
        <div className={clsx('container gx-5')}>
          <div className={clsx(styles['restaurant__nav-content'])}>
            {reduxData?.restaurantDetail?.categories?.map(
              (category: CategoryInfo, index: number, originArr: CategoryInfo[]) => {
                return (
                  <div
                    key={category._id}
                    className={clsx(styles['restaurant__nav-item'], {
                      'restaurant__nav-item--active': category._id === activeCategory,
                      'restaurant__nav-item--only': originArr.length < 5,
                    })}
                    onClick={() => {
                      handleCategoryClick(category._id);
                    }}
                  >
                    <p className={clsx(styles['restaurant__nav-item-name'])}>{category.name}</p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      {Number(reduxData?.restaurantDetail?.categories?.length) > 0 ? (
        <div className={clsx(styles['restaurant__products'])}>
          <div className={clsx('container gx-5')}>
            {reduxData?.restaurantDetail?.categories?.map((category: CategoryInfo, index: number) => (
              <div key={index} className={clsx(styles['restaurant__products-group'])} id={category._id}>
                <p className={clsx(styles['restaurant__products-name'])}>{category.name}</p>

                <div className={clsx('row g-5')}>
                  {category?.products?.map((product: ProductInfo, index: number) => (
                    <div key={index} className={clsx('col-xl-4')}>
                      <ProductCard
                        className={clsx(styles['restaurant__products-item'])}
                        data={product}
                        restaurantInfo={reduxData?.restaurantDetail}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !reduxData.loading ? (
        <NoResult type="product" />
      ) : null}

      {reduxData.loading && <LoadingStart />}
    </div>
  );
}

export default RestaurantDetail;
