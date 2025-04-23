'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, memo, useState } from 'react';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { Divider, Loader, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconCircleDashedX, IconSearch } from '@tabler/icons-react';

import validationSchema from './schema';
import styles from './Category.module.scss';
import { MOCCA } from '@/constants';
import InputText from '@/share/InputText';
import Breadcrumb from '@/share/Breadcrumb';
import { useAppSelector } from '@/lib/hooks';
import RestaurantList from '@/share/RestaurantList';
import { usePathname, useRouter } from '@/i18n/routing';

function Category() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const isLoading = useAppSelector((state) => state.restaurant.loading);

  const [categoriesInfo, setCategoriesInfo] = useState<{ name?: string; slug?: string }>({});
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCategory = localStorage.getItem('categorySelected');
      const storedCategoryId = localStorage.getItem('idCategorySelected');

      if (storedCategory) {
        setCategoriesInfo(JSON.parse(storedCategory));
      }

      if (storedCategoryId) {
        const parsedCategoryId = JSON.parse(storedCategoryId);
        setCategoryId(parsedCategoryId);
      }
    }
  }, []);

  return (
    <div className={clsx(styles['wrapper'])}>
      <div className={clsx('container gx-5')}>
        <Formik
          initialValues={{ q: query }}
          validationSchema={validationSchema()}
          onSubmit={(values, { setSubmitting }) => {
            if (values.q !== query) {
              router.push(`${pathname}?q=${values.q}`);
            }
            setSubmitting(false);
          }}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form style={{ position: 'relative' }}>
              <InputText
                name="q"
                type="text"
                placeholder={t('restaurant.placeholder')}
                className={clsx(styles['category__search'], values.q && styles['category__search--isValue'])}
              />
              <div className={clsx(styles['category__icon'])}>
                {!isLoading && !values.q && <IconSearch />}
                {isLoading && <Loader size={25} color="var(--primary-bg)" />}
                {values.q && !isLoading && (
                  <div
                    className={clsx(styles['category__icon--close'])}
                    onClick={() => {
                      setFieldValue('q', '');
                      router.push(pathname);
                    }}
                  >
                    <IconCircleDashedX />
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <Divider
        size="sm"
        variant="dashed"
        label={
          <>
            <IconSearch size={18} />
            <Text ml={5} size="md">
              {t('home.result-title')}
            </Text>
          </>
        }
      />

      <div className={clsx('container gx-5')}>
        <div className={clsx(styles['category'])}>
          <Breadcrumb
            listData={[{ title: categoriesInfo.name || '' }]}
          />

          <div className={clsx(styles['category__popular'])}>
            {query ? (
              <>
                {query} {t('restaurant.at')}
                <span className={clsx(styles['category__popular--highlight'])}>{MOCCA}</span>
              </>
            ) : (
              <>
                {t('restaurant.title03')} <span className={clsx(styles['category__popular--highlight'])}>{MOCCA}</span>
              </>
            )}
          </div>

          <div className={clsx(styles['category__list'])}>
            <RestaurantList categoryId={categoryId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Category);
