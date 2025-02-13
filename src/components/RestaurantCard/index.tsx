import Image from 'next/image';
import { memo } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { IconStar, IconStarFilled, IconStarHalfFilled, IconTags } from '@tabler/icons-react';

import styles from './RestaurantCard.module.scss';
import { RestaurantInfo } from '@/types';
import useSessionStorage from '@/hooks/useSessionStorage';
import { Link } from '@/i18n/routing';

interface RestaurantCardProps {
  data: RestaurantInfo;
  className?: string;
}

function RestaurantCard({ data, className }: RestaurantCardProps) {
  const t = useTranslations();
  const { setItem } = useSessionStorage();

  const rating = data.rating || 0;
  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars !== 0;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) stars.push(<IconStarFilled className={clsx(styles['star-icon'])} />);
    else if (i === fullStars + 1 && halfStars) stars.push(<IconStarHalfFilled className={clsx(styles['star-icon'])} />);
    else stars.push(<IconStar className={clsx(styles['star-icon'])} />);
  }

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
          <span className={clsx(styles['restaurant__label-text'])}>MCafe</span>
          <div className={clsx(styles['restaurant__label-tail'])}></div>
        </div>

        <Image
          src={data?.background || '/images/default-img.png'}
          width={480}
          height={270}
          priority
          className={clsx(styles['restaurant__img'])}
          alt="Restaurant image"
        />

        <div className={clsx(styles['restaurant__info'])}>
          <div className={clsx(styles['restaurant__name'])}>{data?.fullname}</div>
          <p className={clsx(styles['restaurant__desc'])}>{data?.description}</p>
          <div className={clsx(styles['restaurant__rating'])}>
            <span className={clsx(styles['restaurant__rating-text'])}>
              {data?.rating ? data.rating.toFixed(1) : 'N/A'}
            </span>
            <div className={clsx(styles['restaurant__rating-stars'])}>
              {stars.map((star, index) => {
                return (
                  <div className={clsx(styles['restaurant__rating-star'])} key={index}>
                    {star}
                  </div>
                );
              })}
            </div>
            <p className={clsx(styles['restaurant__rating-text'])}>Reviews</p>
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
