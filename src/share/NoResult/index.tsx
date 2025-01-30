import Image from 'next/image';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import styles from './NoResult.module.scss';

interface NoResultProps {
  className?: string;
  type?: string | 'restaurant';
}

const NoResult: React.FC<NoResultProps> = ({ className, type = 'restaurant' }) => {
  const t = useTranslations();

  return (
    <div className={clsx(styles['no-result'], className)}>
      <div className={clsx(styles['no-result__container'])}>
        <Image
          width={120}
          height={157}
          alt="No result"
          src="/images/empty-box.png"
          className={clsx(styles['no-result__img'])}
        />
        <div className={clsx(styles['no-result__content'])}>
          <h3 className={clsx(styles['no-result__title'])}>{t(`no-result.title-${type}`)}</h3>
          <p className={clsx(styles['no-result__desc'])}>{t('no-result.desc')}</p>
        </div>
      </div>
    </div>
  );
};

export default NoResult;
