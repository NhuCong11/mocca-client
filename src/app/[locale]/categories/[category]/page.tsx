'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, memo, useState, useRef } from 'react';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { Divider, Loader, Text, RangeSlider, Button } from '@mantine/core';
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
  const hasInteracted = useRef(false);

  // Kiểm tra xem có filter giá trong URL không
  const hasPriceFilter = minPriceParam !== null || maxPriceParam !== null;

  const [categoriesInfo, setCategoriesInfo] = useState<{ name?: string; slug?: string }>({});
  const [categoryId, setCategoryId] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam ? parseInt(minPriceParam) : 0,
    maxPriceParam ? parseInt(maxPriceParam) : 0,
  ]);

  // Theo dõi thay đổi trong URL params và cập nhật thanh trượt
  useEffect(() => {
    const newMinPrice = minPriceParam ? parseInt(minPriceParam) : 0;
    const newMaxPrice = maxPriceParam ? parseInt(maxPriceParam) : 0;

    // Chỉ cập nhật khi giá trị thực sự thay đổi để tránh re-render không cần thiết
    if (priceRange[0] !== newMinPrice || priceRange[1] !== newMaxPrice) {
      setPriceRange([newMinPrice, newMaxPrice]);
    }
  }, [minPriceParam, maxPriceParam]);

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
    hasInteracted.current = true;

    const params = new URLSearchParams(searchParams.toString());

    // Nếu người dùng đặt lại về giá trị mặc định (min = 0, max = 0),
    // thì xóa params để không áp dụng filter
    if (values[0] === 0 && values[1] === 0) {
      params.delete('minPrice');
      params.delete('maxPrice');
    } else {
      params.set('minPrice', values[0].toString());
      params.set('maxPrice', values[1].toString());
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values);
  };

  // Reset giá trị về mặc định
  const resetPriceFilter = () => {
    setPriceRange([0, 0]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
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
            onChange={handlePriceChange}
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

          {hasPriceFilter && (
            <div className="mt-2 text-end">
              <Button size="md" variant="outline" color="teal" onClick={resetPriceFilter}>
                {t('button.btn19')}
              </Button>
            </div>
          )}
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
