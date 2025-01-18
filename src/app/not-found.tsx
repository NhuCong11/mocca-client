import Link from 'next/link';
import Image from 'next/image';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import styles from '@/styles/error.module.scss';

export const metadata = {
  title: 'Mocca Cafe | NotFound 404',
};

function NotFound() {
  const t = useTranslations();

  return (
    <div className={clsx(styles.bgPurple)}>
      <div className={clsx(styles.stars)}>
        <div className={clsx(styles.centralBody)}>
          <h1 className={clsx(styles.errorName)}>{t('errors.404')}</h1>
          <Link href={'/'} className={clsx(styles.btnGoHome)}>
            {t('button.btn13')}
          </Link>
        </div>
        <div className={clsx(styles.objects)}>
          <Image
            className={clsx(styles.objectRocket)}
            src={'/images/error_images/rocket.svg'}
            priority
            alt="rocket"
            width={40}
            height={40}
          />
          <div className={clsx(styles.earthMoon)}>
            <Image
              className={clsx(styles.objectEarth)}
              src={'/images/error_images/earth.svg'}
              priority
              alt="earth"
              width={100}
              height={100}
            />
            <Image
              className={clsx(styles.objectMoon)}
              src={'/images/error_images/moon.png'}
              priority
              alt="moon"
              width={80}
              height={80}
            />
          </div>
        </div>
        <div className={clsx(styles.glowingStars)}>
          <div className={clsx(styles.star)}></div>
          <div className={clsx(styles.star)}></div>
          <div className={clsx(styles.star)}></div>
          <div className={clsx(styles.star)}></div>
          <div className={clsx(styles.star)}></div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
