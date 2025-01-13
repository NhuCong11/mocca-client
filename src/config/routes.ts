import { locales } from '@/i18n/config';

const baseRoutes: string[] = ['/checkout', '/auth/profile'];

export const privateRoutes: string[] = baseRoutes.flatMap((route) => locales.map((locale) => `/${locale}${route}`));
