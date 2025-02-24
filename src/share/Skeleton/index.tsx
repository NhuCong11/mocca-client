'use client';
import { Group, Skeleton } from '@mantine/core';

interface DefaultSkeletonProps {
  quantity?: number;
}

function DefaultSkeleton({ quantity = 4, ...props }: DefaultSkeletonProps) {
  return (
    <Group justify="center">
      {Array.from({ length: quantity }).map((_, index) => (
        <Skeleton key={index} width="90%" height={40} radius="xl" mt={20} {...props} />
      ))}
    </Group>
  );
}

export default DefaultSkeleton;
