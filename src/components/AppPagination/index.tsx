import { Box, Pagination } from '@mantine/core';
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconGripHorizontal,
} from '@tabler/icons-react';

interface AppPaginationProps {
  activePage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
}

function AppPagination({ activePage, setPage, total }: AppPaginationProps) {
  if (total <= 1) return null;

  const controlLinks: Record<string, string> = {
    first: '#page-1',
    last: `#page-${total}`,
    next: `#page-${activePage}`,
    previous: `#page-${activePage}`,
  };

  return (
    <Box p="lg">
      <Pagination
        size="xl"
        value={activePage}
        onChange={(page) => setPage(() => Math.max(1, Math.min(page, total)))}
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
        getItemProps={(page) => ({
          component: 'a',
          href: `#page-${page}`,
        })}
        getControlProps={(control) => (controlLinks[control] ? { component: 'a', href: controlLinks[control] } : {})}
      />
    </Box>
  );
}

export default AppPagination;
