'use client';
import { Flex, Group, Skeleton } from '@mantine/core';

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

export const MessageItemSkeleton = () => {
  return (
    <>
      <Group grow m="md">
        <Flex align="center" gap={10}>
          <Skeleton height={60} circle />
          <Skeleton width="80%" height={20} radius="xl" />
        </Flex>
      </Group>
      <Group grow m="md">
        <Flex align="center" gap={10}>
          <Skeleton height={20} radius="xl" />
          <Skeleton height={60} circle />
        </Flex>
      </Group>
    </>
  );
};

export default DefaultSkeleton;
