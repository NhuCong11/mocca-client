'use client';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { IconArrowNarrowUpDashed } from '@tabler/icons-react';
import { useWindowScroll } from '@mantine/hooks';
import styles from './AppGoToTop.module.scss';

function AppGoToTop() {
  const [{ y }, scrollTo] = useWindowScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [progressScroll, setProgressScroll] = useState(0);

  const scrollToTop = useCallback(() => {
    scrollTo({ y: 0 });
  }, [scrollTo]);

  useEffect(() => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setIsVisible(y > 10);
    setProgressScroll(parseFloat(((y / scrollHeight) * 360).toFixed(2)));
  }, [y]);

  return (
    <div
      className={clsx(styles['go-top__wrapper'], isVisible && styles['go-top__wrapper--show'])}
      style={{ '--progressScroll': `${progressScroll}deg` } as React.CSSProperties}
    >
      <div
        className={clsx(styles['go-top__content'], isVisible && styles['go-top__content--show'])}
        onClick={scrollToTop}
      >
        <IconArrowNarrowUpDashed width={25} height={25} color="var(--primary-bg)" />
      </div>
    </div>
  );
}

export default AppGoToTop;
