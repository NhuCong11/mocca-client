import React, { memo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { IconArrowRight } from '@tabler/icons-react';
import styles from './Breadcrumb.module.scss';

interface BreadcrumbProps {
  className?: string;
  listData: Array<{ name: string; link?: string | '' }>;
}

function Breadcrumb({ className, listData = [] }: BreadcrumbProps) {
  const t = useTranslations();

  return (
    <div className={clsx(styles['breadcrumb'], className)}>
      <div className={clsx(styles['breadcrumb__container'])}>
        <Link href={'/'} className={clsx(styles['breadcrumb__item'])}>
          {t('header.na01')}
        </Link>
        <IconArrowRight width={16} height={16} />

        {listData.map((item, index) => (
          <div key={index} className={clsx(styles['breadcrumb__container'])}>
            {index !== listData.length - 1 ? (
              <>
                <Link className={clsx(styles['breadcrumb__item'])} href={item?.link || ''}>
                  {item?.name}
                </Link>
                <IconArrowRight width={16} height={16} />
              </>
            ) : (
              <p>{item?.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Breadcrumb);
