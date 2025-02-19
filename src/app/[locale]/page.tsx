'use client';
import Image from 'next/image';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { IconCategory2, IconCoffee } from '@tabler/icons-react';

import { bannerFooterItems, infoItems } from './constants';
import styles from '@/styles/Home.module.scss';
import { MOCCA } from '@/constants';
import Button from '@/share/Button';
import Banner from '@/components/Banner';
import ListSlider from '@/share/ListSlider';
import { Link } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations();

  return (
    <div className={clsx(styles['home'])}>
      <Banner />
      <div className={clsx('container gx-5')}>
        <h1 className={clsx(styles['home__title-1'])}>
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
