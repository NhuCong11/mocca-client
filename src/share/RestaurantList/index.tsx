/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useEffect, useState } from 'react';
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
  const pageParam = Number(getParam('page')) || 1;

  const restaurantData = useAppSelector((state) => state.restaurant);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [restaurantList, setRestaurantList] = useState<RestaurantInfo[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchRestaurants = useCallback(async () => {
    let result;

    if (!query && !category) {
      result = await dispatch(getRestaurants({ limit, page: currentPage }));
    } else if (query) {
      result = await dispatch(getRestaurants({ limit, page: currentPage, keyword: query }));
    } else {
      const categoryId = JSON.parse(String(sessionStorage.getItem('idCategorySelected')));
      result = await dispatch(
        getRestaurantsByCategory({ categoryID: categoryId, params: { page: currentPage, limit } }),
      );
    }

    if (result?.payload?.code === 200) {
      const { totalPage, shops } = result.payload.data;
      setTotalPages(totalPage);
      setRestaurantList((prev) => (currentPage === 1 ? shops : [...prev, ...shops]));
      setHasMore(currentPage < totalPage);
    }
  }, [category, query, currentPage, dispatch]);

  useEffect(() => {
    if (pageParam !== currentPage) {
      setCurrentPage(pageParam);
    }
  }, [pageParam]);

  useEffect(() => {
    updateParams({ page: String(currentPage) });
    fetchRestaurants();
  }, [query, category, currentPage]);

  return (
    <div className={clsx(styles['restaurant-list'])}>
      <div>
        <InfiniteScroll
          scrollThreshold="0%"
          className={clsx(styles['infinite-scroll'], 'row')}
          dataLength={restaurantList?.length}
          next={() => {
            fetchRestaurants();
          }}
          loader={null}
          hasMore={hasMore}
          scrollableTarget="restaurant-list"
        >
          {restaurantList?.map((item, index) => {
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

      {restaurantData?.loading && (
        <div className={clsx(styles['restaurant-list__loader'])}>
          <Loader size={50} color="var(--primary-bg)" />
        </div>
      )}
      {!restaurantData?.loading && restaurantList?.length === 0 && <NoResult />}
      {restaurantData?.loading && restaurantList?.length <= 0 && <Skeleton />}

      <Pagination total={totalPages} />
    </div>
  );
}

export default memo(RestaurantList);
