import { locales } from '@/i18n/config';

const privatePath: string[] = ['/checkout', '/auth/profile'];
const defaultLayoutPath: string[] = ['/', '/about', '/checkout', '/auth/profile'];
const profilePath: string[] = ['/auth/profile'];

export const convertPathName = (pathNames: string[]): string[] => {
  return pathNames.flatMap((route) => locales.map((locale) => `/${locale}${route}`));
};

export const privateRoutes: string[] = convertPathName(privatePath);

export const defaultLayoutRoutes: string[] = defaultLayoutPath;

export const profileRoute: string[] = profilePath;
