import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import styles from './BannerResults.module.scss';
import { ProductInfo } from '@/types';
import NoResult from '@/share/NoResult';
import ProductCard from '@/share/ProductCard';
import { useAppSelector } from '@/lib/hooks';

function BannerResults() {
  const t = useTranslations();
  const reduxData = useAppSelector((state) => state.searchProduct);

  return (
    <div className={clsx(styles['list'])}>
      <h2 className={clsx(styles['list-title'])}>{t('list-result.list-products')}</h2>
      {reduxData.products.length !== 0 ? (
        <div className={clsx(styles['list-container'])}>
          <div className={clsx('row g-5 g-0')}>
            {reduxData?.products.map((item: ProductInfo, index: number) => {
              return (
                <div key={index} className={clsx('col-xl-4 col-12')}>
                  <ProductCard data={item} restaurantInfo={item.shop} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <NoResult type="product" />
      )}
    </div>
  );
}

export default BannerResults;
