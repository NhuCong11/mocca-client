interface HelpItem {
  strong: string;
  content: string;
  link?: string;
  external?: boolean;
}

interface HelpSection {
  title: string;
  items: HelpItem[];
}

export const MOCCA_EMAIL = 'info.moccacafe@gmail.com';

export const terms = [
  {
    title: 'termsOfUse.title1',
    content: 'termsOfUse.content1',
  },
  {
    title: 'termsOfUse.title2',
    content: 'termsOfUse.content2',
  },
  {
    title: 'termsOfUse.title3',
    content: 'termsOfUse.content3',
  },
  {
    title: 'termsOfUse.title4',
    content: 'termsOfUse.content4',
  },
  {
    title: 'termsOfUse.title5',
    content: 'termsOfUse.content5',
  },
  {
    title: 'termsOfUse.title6',
    content: 'termsOfUse.content6',
  },
  {
    title: 'termsOfUse.title7',
    content: 'termsOfUse.content7',
  },
  {
    title: 'termsOfUse.title8',
    content: 'termsOfUse.content8',
  },
  {
    title: 'termsOfUse.title9',
    content: 'termsOfUse.content9',
  },
];

export const getHelpSections = (t: (key: string) => string): HelpSection[] => [
  {
    title: t('help.title02'),
    items: [
      {
        strong: t('help.strong01'),
        content: `${t('help.content02-1')} ${t('help.content02-2')}`,
        link: '/about',
      },
      {
        strong: t('help.strong02'),
        content: MOCCA_EMAIL,
        link: `mailto:${MOCCA_EMAIL}`,
        external: true,
      },
    ],
  },
  {
    title: t('help.title03'),
    items: [...Array(4)].map((_, i) => ({
      strong: t(`help.strong0${i + 3}`),
      content: t(`help.content0${i + 4}`),
    })),
  },
];
