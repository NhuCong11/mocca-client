import { ComboboxItem, Select } from '@mantine/core';
import { useTranslations } from 'next-intl';

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
  value?: ComboboxItem | null;
  onChange?: (value: ComboboxItem) => void;
}

function SelectBox({
  label,
  disabled = false,
  data = [],
  required = false,
  leftIcon,
  value,
  onChange = () => {},
}: SelectBoxProps) {
  const t = useTranslations();

  const formattedData = data?.map((item) => ({
    value: `${item.value}` || '',
    label: item.label || '',
  }));

  return (
    <Select
      size="xl"
      miw={200}
      clearable
      searchable
      label={label}
      withScrollArea
      required={required}
      placeholder={label}
      disabled={disabled}
      leftSection={leftIcon}
      allowDeselect={false}
      maxDropdownHeight={300}
      checkIconPosition="right"
      data={formattedData}
      value={value ? value.value : null}
      onChange={(_value, option) => onChange(option)}
      nothingFoundMessage={t('checkout.desc08')}
      comboboxProps={{ transitionProps: { transition: 'pop-top-left', duration: 300 }, shadow: 'sm' }}
    />
  );
}

export default SelectBox;
