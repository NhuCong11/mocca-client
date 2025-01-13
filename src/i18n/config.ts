export type Locale = (typeof locales)[number];

export const locales = ['vi', 'en', 'zh', 'ko'] as const;
export const defaultLocale: Locale = 'vi';
