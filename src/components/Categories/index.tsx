import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Loader } from '@mantine/core';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './Categories.module.scss';
import { CategoryInfo } from '@/types';
import { Link } from '@/i18n/routing';
import NoResult from '@/share/NoResult';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import useSessionStorage from '@/hooks/useSessionStorage';
import { getCategories } from '@/services/categoriesServices';

const normalizeString = (str: string) => {
  return str
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
};

function Categories() {
  const dispatch = useAppDispatch();
  const { setItem } = useSessionStorage();
  const { loading, listCategories, data } = useAppSelector((state) => state.categories);

  const [currentPage, setCurrentPage] = useState(1);
  const hasMore = useMemo(() => {
    return currentPage < Number(data?.totalPage);
  }, [currentPage, data?.totalPage]);

  const fetchMoreData = useCallback(() => {
    if (!loading) {
      dispatch(getCategories({ limit: Number(data?.limit), page: currentPage + 1 }));
      setCurrentPage((prev) => prev + 1);
    }
  }, [dispatch, currentPage, loading, data?.limit]);

  const handleClickCategory = (item: CategoryInfo) => {
    setItem('categorySelected', { name: item.name, slug: item.slug });
    setItem('idCategorySelected', item?._id);
  };

  useEffect(() => {
    if (!loading && listCategories.length === 0) {
      fetchMoreData();
    }
  }, [fetchMoreData, loading, listCategories.length]);

  return (
    <div className={clsx(styles['categories'], 'row', 'gx-xl-2', 'g-0')}>
      <InfiniteScroll
        loader={null}
        hasMore={hasMore}
        next={fetchMoreData}
        scrollThreshold="20%"
        dataLength={listCategories.length}
        className={clsx(styles['infinite-scroll'], 'row')}
      >
        {listCategories.map((item: CategoryInfo, index: number) => (
          <Link
            href={`/categories/${normalizeString(item.slug)}`}
            key={index}
            className={clsx('col-xl-3 col-6')}
            onClick={() => {
              handleClickCategory(item);
            }}
          >
            <div>
              <div className={clsx(styles['categories__item'])} key={item._id}>
                <Image
                  priority
                  width={324}
                  height={200}
                  className={clsx(styles['category-img'])}
                  src={item.image || '/images/default-img.png'}
                  alt={item.name}
                />
                <span className={clsx(styles['category-name'])}>{item.name}</span>
              </div>
            </div>
          </Link>
        ))}
        {listCategories.length <= 0 && !loading && <NoResult type="category" />}
      </InfiniteScroll>

      {loading && (
        <div className={clsx(styles['categories__loader'])}>
          <Loader size={60} color="var(--primary-bg)" />
        </div>
      )}
    </div>
  );
}

export default Categories;
