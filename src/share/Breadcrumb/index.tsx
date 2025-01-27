import React, { memo, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Breadcrumbs, Anchor } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';

interface BreadcrumbProps {
  listData?: Array<{ title: string; href?: string }>;
}

function Breadcrumb({ listData = [] }: BreadcrumbProps) {
  const t = useTranslations();

  const items = useMemo(() => {
    const defaultItem = { title: t('header.na01'), href: '/' };
    const fullList = [defaultItem, ...listData];

    return fullList.map((item, index) => (
      <Anchor
        key={index}
        component={Link}
        fz="h2"
        fw={500}
        underline="never"
        c="var(--coffee-color)"
        href={item.href || '/'}
      >
        {item.title}
      </Anchor>
    ));
  }, [listData, t]);

  return (
    <Breadcrumbs separator={<IconArrowRight width={16} height={16} />} separatorMargin="md" mt="xs">
      {items}
    </Breadcrumbs>
  );
}

export default memo(Breadcrumb);
