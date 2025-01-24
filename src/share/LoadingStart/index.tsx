'use client';
import { useEffect } from 'react';
import clsx from 'clsx';
import styles from './LoadingStart.module.scss';

function LoadingStart() {
  useEffect(() => {
    const disableScroll = (event: Event) => {
      event.preventDefault();
    };

    window.addEventListener('wheel', disableScroll, { passive: false });
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('wheel', disableScroll, { passive: false } as AddEventListenerOptions);
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={clsx(styles['modal-loading'])}>
      <div className={clsx(styles['modal-loading__content'])}>
        <div className={clsx(styles['loading-start'])}>
          <span className={clsx(styles['loading-start__1'])}>
            <span className={clsx(styles['loading-start__2'])}>
              <span className={clsx(styles['loading-start__3'])}>
                <span className={clsx(styles['loading-start__4'])}></span>
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoadingStart;
