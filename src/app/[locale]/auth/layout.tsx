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
            <Image className={clsx(styles['logo__img'])} src={'/images/logo.png'} priority alt="Mocca Cafe" />
          </Link>
        </div>
      )}
      <div className={clsx(!profileRoute.includes(pathName) && styles['container'])}>{children}</div>
    </div>
  );
}

export default AuthLayout;
