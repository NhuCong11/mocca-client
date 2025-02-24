/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Loader } from '@mantine/core';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './RestaurantList.module.scss';
import { RestaurantInfo } from '@/types';
import NoResult from '@/share/NoResult';
import Skeleton from '@/share/Skeleton';
import RestaurantCard from '@/share/RestaurantCard';
import Pagination from '@/components/AppPagination';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getRestaurants, getRestaurantsByCategory } from '@/services/restaurantServices';

function RestaurantList({ category }: { category?: boolean }) {
  const limit = 8;
  const dispatch = useAppDispatch();
  const { getParam, updateParams } = useQueryParams();
  const query = getParam('q');
  const pagePrams = Number(getParam('page'));
  const restaurantData = useAppSelector((state) => state.restaurant);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(pagePrams || 1);
  const [restaurantList, setRestaurantList] = useState<RestaurantInfo[]>([]);

  const fetchRestaurants = async () => {
    if (!query && !category) {
      await dispatch(getRestaurants({ limit: limit, page: currentPage })).then((result) => {
        if (result?.payload?.code === 200) {
          setTotalPages(result?.payload?.data?.totalPage);
          setRestaurantList(result?.payload?.data?.shops);
        }
      });
    } else if (query) {
      await dispatch(getRestaurants({ limit: limit, page: currentPage, keyword: query })).then((result) => {
        if (result?.payload?.code === 200) {
          if (result?.payload?.data?.totalResult > 0) {
            setTotalPages(result?.payload?.data?.totalPage);
            setRestaurantList(result?.payload?.data?.shops);
          }
        }
      });
    } else if (category) {
      const categoryId = JSON.parse(String(sessionStorage.getItem('idCategorySelected')));
      await dispatch(
        getRestaurantsByCategory({ categoryID: categoryId, params: { page: currentPage, limit: limit } }),
      ).then((result) => {
        if (result?.payload?.code === 200) {
          setTotalPages(result?.payload?.data?.totalPage);
          setRestaurantList(result?.payload?.data?.shops);
        }
      });
    }
  };

  useEffect(() => {
    setCurrentPage(pagePrams || 1);
  }, [query, category, pagePrams]);

  useEffect(() => {
    updateParams({ page: String(currentPage) });
    setTotalPages(0);
    setRestaurantList([]);
    fetchRestaurants();
  }, [query, category, currentPage]);

  return (
    <div className={clsx(styles['restaurant-list'])}>
      <div>
        <InfiniteScroll
          scrollThreshold="0%"
          className={clsx(styles['infinite-scroll'], 'row')}
          dataLength={restaurantList.length}
          next={() => {
            fetchRestaurants();
          }}
          loader={null}
          hasMore={false}
          scrollableTarget="restaurant-list"
        >
          {restaurantList.map((item, index) => {
            return (
              <div key={index} className={clsx('col-xl-3 col-6')}>
                <div>
                  <RestaurantCard data={item} className={clsx(styles['restaurant-list__item'])} />
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>

      {restaurantData.loading && (
        <div className={clsx(styles['restaurant-list__loader'])}>
          <Loader size={50} color="var(--primary-bg)" />
        </div>
      )}
      {!restaurantData.loading && restaurantList.length === 0 && <NoResult />}
      {restaurantData.loading && restaurantList.length <= 0 && <Skeleton />}

      <Pagination total={totalPages} />
    </div>
  );
}

export default memo(RestaurantList);
