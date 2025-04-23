/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Loader } from '@mantine/core';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './RestaurantList.module.scss';
import { ProductInfo, RestaurantInfo, DefaultParams } from '@/types';
import NoResult from '@/share/NoResult';
import Skeleton from '@/share/Skeleton';
import ProductCard from '@/share/ProductCard';
import RestaurantCard from '@/share/RestaurantCard';
import Pagination from '@/components/AppPagination';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getRestaurants, getRestaurantsByCategory } from '@/services/restaurantServices';
import { searchProduct } from '@/services/searchProductServices';

interface ProductSearchParams extends DefaultParams {
  category?: string;
}

function RestaurantList({ category, categoryId }: { category?: boolean; categoryId?: string }) {
  const limit = 8;
  const dispatch = useAppDispatch();
  const { getParam, updateParams } = useQueryParams();
  const query = getParam('q');
  const pageParam = Number(getParam('page')) || 1;

  const restaurantData = useAppSelector((state) => state.restaurant);
  const productData = useAppSelector((state) => state.searchProduct);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [restaurantList, setRestaurantList] = useState<RestaurantInfo[]>([]);
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showProducts, setShowProducts] = useState(false);

  const fetchData = useCallback(async () => {
    // Check if we should fetch products by category
    if (categoryId) {
      setShowProducts(true);
      const params: ProductSearchParams = {
        limit,
        page: currentPage,
        category: categoryId,
      };

      if (query) {
        params.keyword = query;
      }

      const result = await dispatch(searchProduct(params));

      if (result?.payload?.code === 200) {
        const { totalPage, products } = result.payload.data;
        setTotalPages(totalPage);
        setProductList((prev) => (currentPage === 1 ? products : [...prev, ...products]));
        setHasMore(currentPage < totalPage);
      }
      return;
    }

    // Original restaurant fetching logic
    setShowProducts(false);
    let result;

    if (!query && !category) {
      result = await dispatch(getRestaurants({ limit, page: currentPage }));
    } else if (query) {
      result = await dispatch(getRestaurants({ limit, page: currentPage, keyword: query }));
    } else {
      const storedCategoryId = localStorage.getItem('idCategorySelected');
      const catId = storedCategoryId ? JSON.parse(storedCategoryId) : null;

      if (catId) {
        result = await dispatch(getRestaurantsByCategory({ categoryID: catId, params: { page: currentPage, limit } }));
      }
    }

    if (result?.payload?.code === 200) {
      const { totalPage, shops } = result.payload.data;
      setTotalPages(totalPage);
      setRestaurantList((prev) => (currentPage === 1 ? shops : [...prev, ...shops]));
      setHasMore(currentPage < totalPage);
    }
  }, [category, categoryId, query, currentPage, dispatch]);

  useEffect(() => {
    if (pageParam !== currentPage) {
      setCurrentPage(pageParam);
    }
  }, [pageParam]);

  useEffect(() => {
    updateParams({ page: String(currentPage) });
    fetchData();
  }, [query, category, categoryId, currentPage]);

  const isLoading = showProducts ? productData?.loading : restaurantData?.loading;
  const itemsLength = showProducts ? productList?.length : restaurantList?.length;

  return (
    <div className={clsx(styles['restaurant-list'])}>
      <div>
        <InfiniteScroll
          scrollThreshold="0%"
          className={clsx(styles['infinite-scroll'], 'row g-4')}
          dataLength={itemsLength}
          next={() => {
            fetchData();
          }}
          loader={null}
          hasMore={hasMore}
          scrollableTarget="restaurant-list"
        >
          {showProducts
            ? productList?.map((item, index) => (
                <div key={index} className={clsx('col-xl-4 col-6')}>
                  <ProductCard
                    data={item}
                    restaurantInfo={item.shop}
                    className={clsx(styles['restaurant-list__item'])}
                  />
                </div>
              ))
            : restaurantList?.map((item, index) => (
                <div key={index} className={clsx('col-xl-3 col-6')}>
                  <RestaurantCard data={item} className={clsx(styles['restaurant-list__item'])} />
                </div>
              ))}
        </InfiniteScroll>
      </div>

      {isLoading && (
        <div className={clsx(styles['restaurant-list__loader'])}>
          <Loader size={50} color="var(--primary-bg)" />
        </div>
      )}
      {!isLoading && itemsLength === 0 && <NoResult />}
      {isLoading && itemsLength <= 0 && <Skeleton />}

      <Pagination total={totalPages} />
    </div>
  );
}

export default memo(RestaurantList);
