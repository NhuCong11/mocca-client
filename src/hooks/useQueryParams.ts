/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type UpdateQueryParams = {
  [key: string]: string | null;
};

export const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hàm để lấy giá trị của một param
  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  // Hàm để lấy tất cả giá trị trên param
  const getAllParams = useCallback(() => {
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    return paramsObj;
  }, [searchParams]);

  // Hàm để cập nhật searchParams, có thể thêm, thay đổi hoặc xoá param
  const updateParams = useCallback(
    (newParams: UpdateQueryParams) => {
      const currentParams = new URLSearchParams(searchParams as any);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null) {
          currentParams.delete(key); // Xoá param nếu value là null
        } else {
          currentParams.set(key, value); // Cập nhật hoặc thêm mới param
        }
      });

      // Thay đổi URL với các params mới
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Hàm để xoá toàn bộ params
  const clearParams = useCallback(() => {
    router.replace(`${pathname}`, { scroll: false });
  }, [router, pathname]);

  return useMemo(
    () => ({
      getParam,
      getAllParams,
      updateParams,
      clearParams,
    }),
    [getParam, getAllParams, updateParams, clearParams],
  );
};
