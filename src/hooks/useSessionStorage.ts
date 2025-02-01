/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';

function useSessionStorage() {
  const setItem = useCallback((key: string, value: any) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, []);
  const getItem = useCallback((key: string) => JSON.parse(String(sessionStorage.getItem(key))), []);
  return { getItem, setItem };
}

export default useSessionStorage;
