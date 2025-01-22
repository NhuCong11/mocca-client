import { locales } from '@/i18n/config';

export const ERROR_MESSAGES = {
  JWT_EXPIRED_VI: 'jwt hết hạn',
  JWT_EXPIRED_EN: 'jwt expired',
  JWT_EXPIRED_ZH: 'jwt已过期',
  JWT_EXPIRED_KO: 'jwt가 만료되었습니다',
};

const baseRoutes: string[] = ['', '/about', '/checkout', '/profile'];
export const PATH_DEFAULT_LAYOUT: string[] = baseRoutes.flatMap((route) =>
  locales.map((locale) => `/${locale}${route}`),
);

export const MINIMUM_AGE = 14;
