import { useEffect, useState } from 'react';
import { Group, Pagination } from '@mantine/core';
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconGripHorizontal,
} from '@tabler/icons-react';
import { useQueryParams } from '@/hooks/useQueryParams';

interface AppPaginationProps {
  total: number;
}

function AppPagination({ total }: AppPaginationProps) {
  const { getParam, updateParams } = useQueryParams();
  const pageParam = getParam('page');
  const [activePage, setActivePage] = useState(Number(pageParam));

  useEffect(() => {
    if (activePage >= 1 && pageParam) {
      updateParams({ page: String(activePage) });
    }
  }, [activePage, updateParams, pageParam]);

  useEffect(() => {
    if (pageParam) {
      setActivePage(Number(pageParam));
    } else {
      setActivePage(0);
    }
  }, [pageParam]);

  if (total < 1) return null;

  return (
    <Group p="lg" justify="center">
      <Pagination
        size="xl"
        value={activePage}
        onChange={setActivePage}
        total={total}
        withEdges
        autoContrast
        siblings={2}
        color="var(--primary-bg)"
        nextIcon={IconChevronCompactRight}
        previousIcon={IconChevronCompactLeft}
        firstIcon={IconChevronLeftPipe}
        lastIcon={IconChevronRightPipe}
        dotsIcon={IconGripHorizontal}
      />
    </Group>
  );
}

export default AppPagination;
