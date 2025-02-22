/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Loader } from '@mantine/core';
import { IconCircleDashedX, IconSearch } from '@tabler/icons-react';

import styles from './Banner.module.scss';
import validationSchema from './schema';
import { getGreeting, listBanner } from './constant';
import Button from '@/share/Button';
import { Link } from '@/i18n/routing';
import InputText from '@/share/InputText';
import { DefaultParams } from '@/types';
import { searchProduct } from '@/services/searchProductServices';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useQueryParams } from '@/hooks/useQueryParams';

interface BannerProps {
  className?: string;
  page?: number;
  remove?: boolean;
  onSearch?: (value?: any) => void;
  onHandleRemove?: (value?: any) => void;
}

const Banner: React.FC<BannerProps> = ({
  page = 1,
  remove = false,
  onSearch = () => {},
  onHandleRemove = () => {},
}) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { getParam, updateParams, clearParams } = useQueryParams();
  const keyword = getParam('keyword');
  const isLoading = useAppSelector((state) => state.searchProduct.loading);

  const [greeting, setGreeting] = useState('');
  const [bannerPath, setBannerPath] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const setFieldValueRef = useRef<(field: string, value: any) => void>(null);

  const fetchApi = async (searchValue: string, page: number) => {
    onSearch('loading');
    dispatch(searchProduct({ limit: 9, keyword: searchValue, page })).then((result) => {
      if (result.payload?.code === 200) {
        const windowHeight = window.innerHeight - 88;
        const isMobile = window.innerWidth <= 768;
        const adjustedWindowHeight = isMobile ? windowHeight / 2 : windowHeight;
        window.scrollTo({ top: adjustedWindowHeight, behavior: 'smooth' });
      }
    });
    onSearch('true');
  };

  // Call api tìm kiếm
  const handleSearch = (values: DefaultParams) => {
    const isNewKeyword = values.keyword !== keyword;
    if (!values.keyword || values.keyword.trim() === '') {
      handleClear();
      return;
    }
    onHandleRemove();
    updateParams({ keyword: String(values.keyword), page: isNewKeyword ? '1' : String(page) });
    fetchApi(String(values.keyword), isNewKeyword ? 1 : page);
  };

  const handleClear = () => {
    if (setFieldValueRef.current) {
      setFieldValueRef.current('keyword', '');
    }
    onHandleRemove();
    onSearch('false');
    clearParams();
  };

  // Thiết lập câu chào theo thời gian thực
  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    setGreeting(t(`${getGreeting(hours)}`));
  }, []);

  // Random background banner
  useEffect(() => {
    const randomPath = Math.floor(Math.random() * 3);
    setBannerPath(randomPath);
  }, []);

  useEffect(() => {
    if (remove) handleClear();
  }, [remove]);

  useEffect(() => {
    if (!isInitialLoad && keyword && page) {
      fetchApi(String(keyword), page);
    } else {
      setIsInitialLoad(false);
    }
  }, [page]);

  useEffect(() => {
    if (setFieldValueRef.current) {
      setFieldValueRef.current('keyword', keyword ?? '');
    }
    if (keyword) {
      handleSearch({ keyword: keyword } as DefaultParams);
    }
  }, [keyword]);

  return (
    <div className={clsx(styles['banner'])} style={{ backgroundImage: `url(${listBanner[bannerPath]})` }}>
      <div className={clsx('container gx-5')}>
        <div className={clsx(styles['banner__wrapper'])}>
          <div className={clsx(styles['banner__content'])}>
            <h4 data-aos="zoom-in-up" className={clsx(styles['banner__greeting'])}>
              {greeting}
            </h4>
            <h4 data-aos="zoom-in-up" className={clsx(styles['banner__caption'])}>
              {t('home-banner.heading04')}
            </h4>
            <p data-aos="zoom-out" className={clsx(styles['banner__desc'])}>
              {t('home-banner.desc01')}
            </p>

            <div className={clsx(styles['banner__search'])}>
              <div className={clsx(styles['banner__search-container'])}>
                <Formik
                  initialValues={{ keyword: '' } as DefaultParams}
                  validationSchema={validationSchema()}
                  onSubmit={(values) => {
                    handleSearch(values);
                  }}
                  validateOnChange={true}
                  validateOnMount={true}
                >
                  {({ values, setFieldValue }) => {
                    setFieldValueRef.current = setFieldValue;

                    return (
                      <Form>
                        <InputText
                          name="keyword"
                          type="text"
                          placeholder={t('home-banner.placeholder')}
                          autoComplete="off"
                          className={clsx(styles['banner__search-input'])}
                        />

                        {values?.keyword && (
                          <div onClick={handleClear}>
                            <IconCircleDashedX width={20} height={20} className={clsx(styles['banner__icon-close'])} />
                          </div>
                        )}
                        {!isLoading ? (
                          <div onClick={() => handleSearch(values)}>
                            <IconSearch width={24} height={24} className={clsx(styles['banner__icon-search'])} />
                          </div>
                        ) : (
                          <Loader size={30} className={clsx(styles['banner__icon-search'])} />
                        )}
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>

            <Link href={'/restaurants'}>
              <Button more primary>
                {t('button.btn20')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
