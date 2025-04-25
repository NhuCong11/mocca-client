import React, { memo, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';

interface BreadcrumbProps {
  listData?: Array<{ title: string; href?: string }>;
}

function Breadcrumb({ listData = [] }: BreadcrumbProps) {
  const t = useTranslations();
  const defaultItem = useMemo(() => ({ title: t('header.na01'), href: '/' }), [t]);

  const items = useMemo(() => {
    const fullList = [defaultItem, ...listData];

    return fullList.map((item, index) =>
      index !== fullList.length - 1 ? (
        <Anchor
          pt="sm"
          pb="sm"
          key={item.href || index}
          component={Link}
          fz="h2"
          fw={500}
          underline="never"
          c="var(--coffee-color)"
          href={item.href || '/'}
        >
          {item.title}
        </Anchor>
      ) : (
        <Text pt="sm" pb="sm" key={item.href || index} fz="h2" fw={500}>
          {item.title}
        </Text>
      ),
    );
  }, [listData, defaultItem]);

  return (
    <Breadcrumbs separator={<IconArrowRight width={16} height={16} />} separatorMargin="md" mt="xs">
      {items}
    </Breadcrumbs>
  );
}

export default memo(Breadcrumb);
