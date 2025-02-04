import { useCallback, useEffect, useRef, useState } from 'react';

function useClickOutside<T extends HTMLElement, U extends HTMLElement>() {
  const elementRef = useRef<T | null>(null);
  const triggerRef = useRef<U | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      elementRef.current &&
      !elementRef.current.contains(event.target as Node) &&
      !triggerRef.current?.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return { elementRef, triggerRef, isVisible, setIsVisible };
}

export default useClickOutside;
