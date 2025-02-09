import { locales } from '@/i18n/config';

const privatePath: string[] = ['/checkout', '/auth/profile'];
const defaultLayoutPath: string[] = ['', '/about', '/checkout', '/profile'];

export const convertPathName = (pathNames: string[]): string[] => {
  return pathNames.flatMap((route) => locales.map((locale) => `/${locale}${route}`));
};

export const privateRoutes: string[] = convertPathName(privatePath);

export const defaultLayoutRoutes: string[] = convertPathName(defaultLayoutPath);

export const profileRoute: string[] = convertPathName(['/auth/profile']);

export const homeRoute: string[] = convertPathName(['']);
