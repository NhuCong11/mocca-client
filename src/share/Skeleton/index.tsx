'use client';
import { Skeleton } from '@mantine/core';

interface DefaultSkeletonProps {
  quantity?: number;
}

function DefaultSkeleton({ quantity = 4, ...props }: DefaultSkeletonProps) {
  return (
    <>
      {Array.from({ length: quantity }).map((_, index) => (
        <Skeleton key={index} height={40} radius="xl" {...props} />
      ))}
    </>
  );
}

export default DefaultSkeleton;
