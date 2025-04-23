import { MOCCA } from '@/constants';
import { IconAlignBoxLeftStretch, IconShoppingBag } from '@tabler/icons-react';

export const statusData = (brand?: string) => [
  {
    Icon: IconAlignBoxLeftStretch,
    title: 'productDetail.title05',
    desc: brand ?? MOCCA,
    descClass: 'brand',
  },
  {
    Icon: IconShoppingBag,
    title: 'productDetail.title03',
    desc: 'productDetail.status01',
    descClass: 'in_stock',
  },
];
