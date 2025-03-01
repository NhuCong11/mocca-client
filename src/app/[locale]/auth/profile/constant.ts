import { MOCCA } from '@/constants';
import {
  IconCoin,
  IconDotsVertical,
  IconHelp,
  IconHistory,
  IconKey,
  IconListDetails,
  IconSettingsCog,
  IconUser,
} from '@tabler/icons-react';

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

export const LIST_CHAR = '-';
export const MOCCA_EMAIL = 'info.moccacafe@gmail.com';
export const MOCCA_COIN = 'Mocca Cafe Coin: ';
export const ERROR_READ_FILE = 'Đã xảy ra lỗi khi đọc file.';
export const QR_URL = 'https://img.vietqr.io/image/970423-00005572823-compact.jpg?addInfo=';

export const listNavbar = [
  {
    title: 'profile.navTitle01',
    Icon: IconListDetails,
    isTitle: true,
  },
  {
    title: 'profile.nav01',
    navId: 'personalInfo',
    Icon: IconUser,
    titleName: 'profile.navTitle01',
  },
  {
    title: 'profile.nav02',
    navId: 'changePassword',
    Icon: IconKey,
    titleName: 'profile.navTitle01',
  },
  {
    title: 'profile.nav05',
    navId: 'authTwinSetup',
    Icon: IconSettingsCog,
    titleName: 'profile.navTitle01',
  },
  {
    title: 'profile.navTitle03',
    isTitle: true,
    Icon: IconListDetails,
  },
  {
    title: 'profile.nav06',
    titleName: 'profile.navTitle03',
    Icon: IconHistory,
  },
  {
    title: 'profile.nav07',
    titleName: 'profile.navTitle03',
    Icon: IconCoin,
  },
  {
    title: 'profile.navTitle02',
    isTitle: true,
    Icon: IconListDetails,
  },
  {
    title: 'profile.nav03',
    navId: 'help',
    titleName: 'profile.navTitle02',
    Icon: IconHelp,
  },
  {
    title: 'profile.nav04',
    navId: 'termsOfUse',
    titleName: 'profile.navTitle02',
    Icon: IconDotsVertical,
  },
];

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

export const bankDetails = [
  { label: 'topUp.title02', value: '00005572823' },
  { label: 'topUp.title03', value: 'NGUYEN NHU CONG', extraClass: 'wallet__qr-value--green' },
  { label: 'topUp.title04', value: '1 VNĐ = 1 Mocca Cafe coin' },
  { label: 'topUp.title05', value: '10.000 VNĐ' },
];

export const notes = [
  {
    desc: 'topUp.desc01',
  },
  {
    desc: 'topUp.desc02',
  },
  {
    desc: 'topUp.desc03',
    link: 'https://www.facebook.com/messages/t/274451679080721',
    linkText: 'topUp.desc04',
    rightDesc: 'topUp.desc05',
  },
];

export const authTwinSetupDesc = [
  {
    desc: 'authTwinSetup.desc01',
  },
  {
    desc: 'authTwinSetup.desc02',
  },
  {
    desc: 'authTwinSetup.desc03-1',
    link: [
      'https://apps.apple.com/us/app/google-authenticator/id388497605',
      'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US&pli=1',
    ],
    linkText: ['IOS', 'Android'],
  },
];

export const authTwinSetupNotes = [
  {
    note: 'authTwinSetup.note01',
    strong: MOCCA,
  },
  {
    note: 'authTwinSetup.note02',
  },
  {
    note: 'authTwinSetup.note03',
  },
  {
    note: 'authTwinSetup.note04',
  },
];

export const formatSecretKey = (key: string) => key.match(/.{1,4}/g)?.join(' ') || key;
