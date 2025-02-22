'use client';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Loader } from '@mantine/core';
import { IconCategory, IconCategory2, IconCircleDashedX, IconCoffee } from '@tabler/icons-react';

import { bannerFooterItems, infoItems } from './constants';
import styles from '@/styles/Home.module.scss';
import { MOCCA } from '@/constants';
import Button from '@/share/Button';
import Banner from '@/components/Banner';
import ListSlider from '@/share/ListSlider';
import { Link } from '@/i18n/routing';
import Categories from '@/components/Categories';
import { useAppSelector } from '@/lib/hooks';
import BannerResults from '@/components/BannerResults';
import AppPagination from '@/components/AppPagination';
import { useQueryParams } from '@/hooks/useQueryParams';

export default function Home() {
  const t = useTranslations();
  const { getParam, clearParams } = useQueryParams();
  const searchProduct = useAppSelector((state) => state.searchProduct);

  const [isRemove, setIsRemove] = useState(false);
  const [isSearch, setIsSearch] = useState<'loading' | 'true' | 'false'>('false');

  const handleRemove = () => {
    setIsRemove(false);
  };
  const handleToggleSearch = (type: 'loading' | 'true' | 'false') => {
    setIsSearch(type);
  };
  const handleClickClose = () => {
    setIsRemove(true);
    handleToggleSearch('false');
    clearParams();
  };

  const getIsSearch = () => {
    if (isSearch === 'loading') {
      return 'home__search--loading';
    } else if (isSearch === 'true') {
      return 'home__search--show';
    } else if (isSearch === 'false') {
      return 'home__search--hidden';
    } else {
      return '';
    }
  };

  return (
    <div className={clsx(styles['home'])}>
      <Banner
        remove={isRemove}
        onHandleRemove={handleRemove}
        onSearch={handleToggleSearch}
        page={Number(getParam('page'))}
      />

      <div className={clsx('container gx-5')}>
        {searchProduct.loading ? (
          <div className={clsx(styles['home__search-loading'])}>
            <Loader size={60} color="var(--primary-bg)" />
          </div>
        ) : (
          <div className={clsx(styles[`${getIsSearch()}`])}>
            <div className={clsx(styles['home__search-container'])}>
              <h4 className={clsx(styles['home__search-title'])}>{t('home.result-title')}</h4>
              <div className={clsx(styles['home__close'])} onClick={handleClickClose}>
                <h4 className={clsx(styles['home__close-title'])}>{t('home.close-btn')}</h4>
                <IconCircleDashedX className={clsx(styles['home__close-icon'])} />
              </div>
            </div>
            <BannerResults />
            <AppPagination total={searchProduct.totalPage} />
          </div>
        )}

        <h1 className={clsx(styles['home__title-1'])}>
          <IconCategory size={30} color="var(--primary-bg)" />
          {t('home.title01')}
          <IconCoffee size={30} color="var(--coffee-color)" />
          <span className={clsx(styles['home__title-1--highlight'])}>{MOCCA}</span>
        </h1>
        <ListSlider />
        <Button primary className={clsx(styles['home__btn'])} to={'/restaurants'}>
          {t('home.see-all-restaurants')}
        </Button>
        <h2 className={clsx(styles['home__title-2'], styles['home__title--margin'])}>
          <IconCategory2 size={30} color="var(--primary-bg)" />
          {t('home.title02')}
        </h2>
        <Categories />
      </div>

      <section className={clsx(styles['home__contact'])}>
        <div className={clsx('container gx-5')}>
          <div className={clsx(styles['home__contact-container'])}>
            <h2 className={clsx(styles['home__contact-title'], styles['home__contact-title--primary'])}>
              {t('home.title05')}
            </h2>
            <h2 className={clsx(styles['home__contact-title'])}>{t('home.title06')}</h2>
            <p className={clsx(styles['home__contact-desc'])}>{t('home.desc03')}</p>
            <Link href={'/about'}>
              <Button more primary>
                {t('home.btn01')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <article className={clsx(styles['home__info'])}>
        <div className={clsx('container gx-5')}>
          <div className={clsx('row justify-content-center')}>
            {infoItems.map(({ key, img, desc }, index) => (
              <div
                key={index}
                className={clsx('col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-6', index === 2 && 'gy-lg-0 gy-md-5')}
              >
                <section className={clsx(styles['home__info-item'], styles['home__info-item--nbl'])}>
                  <Image
                    priority
                    width={106}
                    height={94}
                    alt={t(key)}
                    src={img}
                    className={clsx(styles['home__info-img'])}
                  />
                  <h4 className={clsx(styles['home__info-title'])}>{t(key)}</h4>
                  <p className={clsx(styles['home__info-desc'])}>{t(desc)}</p>
                </section>
              </div>
            ))}
          </div>
        </div>
      </article>

      <div className={clsx(styles['banner-footer'])}>
        <div className={clsx('container gx-5')}>
          <div className={clsx('row')}>
            {bannerFooterItems.map(({ key, desc, img }, index) => (
              <div key={index} className={clsx('col-md-6 col-12')}>
                <div className={clsx(styles['banner-footer__left'])}>
                  <Image
                    priority
                    width={130}
                    height={130}
                    alt={MOCCA}
                    src={img}
                    className={clsx(styles['banner-footer__left-img'])}
                  />
                  <h4 className={clsx(styles['banner-footer__title'])}>{t(key)}</h4>
                  <p className={clsx(styles['banner-footer__desc'])}>{t(desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
