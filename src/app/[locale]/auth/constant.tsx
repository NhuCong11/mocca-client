import { ActionIcon } from '@mantine/core';
import { IconKey, IconKeyOff } from '@tabler/icons-react';

interface IconKeyProps {
  showPassword: boolean;
  onToggle: () => void;
}

export const IconKeyPassword = ({ showPassword, onToggle }: IconKeyProps) => {
  return (
    <ActionIcon variant="transparent" size="xl" onClick={onToggle}>
      {showPassword ? <IconKeyOff /> : <IconKey />}
    </ActionIcon>
  );
};
