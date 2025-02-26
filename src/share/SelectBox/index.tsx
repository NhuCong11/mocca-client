import { ComboboxItem, Select } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export interface ItemInfo {
  value?: string | number;
  label?: string;
}

interface SelectBoxProps {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  data?: ItemInfo[];
  leftIcon?: React.ReactNode;
}

function SelectBox({ label, disabled = false, data = [], required = false, leftIcon }: SelectBoxProps) {
  const t = useTranslations();

  const formattedData = data?.map((item) => ({
    value: `${item.value}` || '',
    label: item.label || '',
  }));
  const [value, setValue] = useState<ComboboxItem | null>(null);

  return (
    <Select
      size="xl"
      w={500}
      clearable
      searchable
      label={label}
      withScrollArea
      required={required}
      placeholder={label}
      disabled={disabled}
      leftSection={leftIcon}
      allowDeselect={false}
      maxDropdownHeight={200}
      checkIconPosition="right"
      data={formattedData}
      value={value ? value.value : null}
      onChange={(_value, option) => setValue(option)}
      nothingFoundMessage={t('checkout.desc08')}
      comboboxProps={{ transitionProps: { transition: 'pop-top-left', duration: 300 }, shadow: 'sm' }}
    />
  );
}

export default SelectBox;
