'use client';
import { useState } from 'react';
import { useClickOutside } from '@mantine/hooks';

function useClickOutSide() {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));

  return {
    opened,
    setOpened,
    ref,
  };
}

export default useClickOutSide;
