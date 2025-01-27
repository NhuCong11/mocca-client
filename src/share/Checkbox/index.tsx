import React from 'react';
import { Checkbox, CheckboxProps } from '@mantine/core';

interface CustomCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
  checkLabel?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checkLabel, size = 'lg', onChange, ...props }) => {
  return <Checkbox label={checkLabel} onChange={onChange} color="var(--primary-bg)" size={size} {...props} />;
};

export default React.memo(CustomCheckbox);
