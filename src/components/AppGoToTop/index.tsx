'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { IconArrowNarrowUpDashed } from '@tabler/icons-react';
import styles from './AppGoToTop.module.scss';

function AppGoToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progressScroll, setProgressScroll] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const checkScroll = () => {
      if (!isVisible && window.scrollY > 0) {
        setIsVisible(true);
      }
      if (isVisible && window.scrollY === 0) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', checkScroll);

    return () => window.removeEventListener('scroll', checkScroll);
  }, [isVisible]);

  useEffect(() => {
    const checkProgressScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      const scrollDegrees = (scrollPercent / 100) * 360;
      setProgressScroll(parseFloat(scrollDegrees.toFixed(2)));
    };

    window.addEventListener('scroll', checkProgressScroll);

    return () => window.removeEventListener('scroll', checkProgressScroll);
  }, []);

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
