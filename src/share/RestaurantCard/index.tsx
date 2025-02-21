import Image from 'next/image';
import { memo } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Rating } from '@mantine/core';
import { IconTags } from '@tabler/icons-react';

import styles from './RestaurantCard.module.scss';
import { RestaurantInfo } from '@/types';
import useSessionStorage from '@/hooks/useSessionStorage';
import { Link } from '@/i18n/routing';
import { EMPTY_CHAR, MCAFE, REVIEW } from '@/constants';

interface RestaurantCardProps {
  data: RestaurantInfo;
  className?: string;
}

function RestaurantCard({ data, className }: RestaurantCardProps) {
  const t = useTranslations();
  const { setItem } = useSessionStorage();

  return (
    <Link href={`/restaurants/${data?.slug}`}>
      <div
        className={clsx(styles['restaurant'], className)}
        onClick={() => {
          setItem('restaurantIDSelected', data._id);
          setItem('restaurantSelected', { name: data?.fullname, slug: data?.slug });
        }}
      >
        <div className={clsx(styles['restaurant__label'])}>
          <span className={clsx(styles['restaurant__label-text'])}>{MCAFE}</span>
          <div className={clsx(styles['restaurant__label-tail'])}></div>
        </div>

        <Image
          src={data?.background || '/images/default-img.png'}
          width={480}
          height={270}
          priority
          className={clsx(styles['restaurant__img'])}
          alt={data?.fullname || 'Restaurant image'}
        />

        <div className={clsx(styles['restaurant__info'])}>
          <h4 className={clsx(styles['restaurant__name'])}>{data?.fullname}</h4>
          <p className={clsx(styles['restaurant__desc'])}>{data?.description ?? EMPTY_CHAR}</p>
          <div className={clsx(styles['restaurant__rating'])}>
            {data?.rating ? data.rating.toFixed(1) : 'N/A'}
            <Rating value={Number(data.rating || 0)} size="lg" fractions={2} readOnly />
            <p className={clsx(styles['restaurant__rating-text'])}>{REVIEW}</p>
          </div>

          <div className={clsx(styles['restaurant__discount'])}>
            <div className={clsx(styles['restaurant__discount-tag'])}>
              <IconTags />
            </div>
            <p className={clsx(styles['restaurant__discount-text'])}>{t('restaurantCard.desc01')}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(RestaurantCard);
