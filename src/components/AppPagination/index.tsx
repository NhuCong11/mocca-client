import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Pagination } from '@mantine/core';
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconGripHorizontal,
} from '@tabler/icons-react';

interface AppPaginationProps {
  total: number;
}

function AppPagination({ total }: AppPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePage, setActivePage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(activePage));
    router.push(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  if (total <= 1) return null;

  return (
    <Box p="lg">
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
    </Box>
  );
}

export default AppPagination;
