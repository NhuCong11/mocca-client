import Image from 'next/image';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { IconTagPlus } from '@tabler/icons-react';

import styles from './ProductCard.module.scss';
import { getVNCurrency } from '@/utils/constants';
import { ProductInfo, RestaurantInfo } from '@/types';
import useSessionStorage from '@/hooks/useSessionStorage';

interface ProductCardProps {
  data: ProductInfo;
  className?: string;
  restaurantInfo?: RestaurantInfo;
}

function ProductCard({ data, className, restaurantInfo }: ProductCardProps) {
  const router = useRouter();
  const { setItem } = useSessionStorage();

  const handleClickProduct = () => {
    setItem('restaurantSelected', { name: restaurantInfo?.fullname, slug: restaurantInfo?.slug });
    setItem('restaurantIDSelected', restaurantInfo?._id);
    setItem('productSelected', { name: data?.name, slug: data?.slug });
    setItem('productIDSelected', data?._id);
    router.push(`/restaurants/${restaurantInfo?.slug}/${data?.slug}`);
  };

  return (
    <div className={clsx(styles['product'], className)} onClick={handleClickProduct}>
      <Image
        priority
        width={720}
        height={720}
        alt={data?.name}
        src={data?.image}
        className={clsx(styles['product__img'])}
      />

      <div className={clsx(styles['product__info'])}>
        <h4 className={clsx(styles['product__name'])}>{data?.name}</h4>
        <p className={clsx(styles['product__desc'])}>{data?.description}</p>

        <div className={clsx(styles['product__last-row'])}>
          <span className={clsx(styles['product__price'])}>{getVNCurrency(data?.price)}</span>
          <div className={clsx(styles['product__add-cart'])}>
            <IconTagPlus color="var(--white)" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
