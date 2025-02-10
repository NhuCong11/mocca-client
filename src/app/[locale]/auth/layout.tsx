'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from './layout.module.scss';
import { profileRoute } from '@/config/routes';

function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathName = usePathname();

  return (
    <div className={clsx(styles['wrapper'])}>
      {!profileRoute.includes(pathName) && (
        <div className={clsx(styles['logo'])}>
          <Link href={'/'}>
            <Image
              priority
              width={145}
              height={45}
              alt="Mocca Cafe"
              src={'/images/logo-vip1.png'}
              className={clsx(styles['logo__img'])}
            />
          </Link>
        </div>
      )}
      <div className={clsx(!profileRoute.includes(pathName) && styles['container'])}>{children}</div>
    </div>
  );
}

export default AuthLayout;
