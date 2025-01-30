'use client';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';

interface CustomLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, className, children }) => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if ((pathname === '/' && href === '/') || pathname === href || href === '/#!') {
      e.preventDefault();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default CustomLink;
