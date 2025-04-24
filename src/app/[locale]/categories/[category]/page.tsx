'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, memo, useState } from 'react';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { Divider, Loader, Text, RangeSlider } from '@mantine/core';
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
import { getVNCurrency } from '@/utils/constants';

function Category() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const isLoading = useAppSelector((state) => state.restaurant.loading);

  const [categoriesInfo, setCategoriesInfo] = useState<{ name?: string; slug?: string }>({});
  const [categoryId, setCategoryId] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam ? parseInt(minPriceParam) : 0,
    maxPriceParam ? parseInt(maxPriceParam) : 500000,
  ]);

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

  const updatePriceFilter = (values: [number, number]) => {
    setPriceRange(values);

    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', values[0].toString());
    params.set('maxPrice', values[1].toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={clsx(styles['wrapper'])}>
      <div className={clsx('container gx-5')}>
        <Formik
          initialValues={{ q: query }}
          validationSchema={validationSchema()}
          onSubmit={(values, { setSubmitting }) => {
            if (values.q !== query) {
              const params = new URLSearchParams(searchParams.toString());
              params.set('q', values.q);

              router.push(`${pathname}?${params.toString()}`);
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
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete('q');

                      if (params.toString()) {
                        router.push(`${pathname}?${params.toString()}`);
                      } else {
                        router.push(pathname);
                      }
                    }}
                  >
                    <IconCircleDashedX />
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>

        <div className={clsx('mt-4 mb-4', styles['category__range'])}>
          <Text fw={500} mb={10} size="xl">
            {t('category.price_range')}
          </Text>

          <RangeSlider
            size="lg"
            mt="lg"
            min={0}
            color="teal"
            max={2000000}
            step={100000}
            minRange={0}
            restrictToMarks
            value={priceRange}
            onChange={setPriceRange}
            onChangeEnd={updatePriceFilter}
            label={null}
            marks={[
              { value: 0 },
              { value: 200000 },
              { value: 400000 },
              { value: 600000 },
              { value: 800000 },
              { value: 1000000 },
              { value: 1200000 },
              { value: 1400000 },
              { value: 1600000 },
              { value: 1800000 },
              { value: 2000000 },
            ]}
          />
          <div className="mt-3 d-flex justify-content-between">
            <div>{getVNCurrency(priceRange[0])}</div>
            <div>{getVNCurrency(priceRange[1])}</div>
          </div>
        </div>
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
          <Breadcrumb listData={[{ title: categoriesInfo.name || '' }]} />

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
