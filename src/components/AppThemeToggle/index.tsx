'use client';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSunset2 } from '@tabler/icons-react';
import styles from './AppThemeToggle.module.scss';

function AppThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const { setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  const handleClick = () => {
    const themeText = theme === 'dark' ? 'light' : 'dark';
    setTheme(themeText);
    setColorScheme(themeText);
  };

  const icon = useMemo(() => {
    const currentTheme = theme ?? systemTheme;
    return currentTheme === 'dark' ? <IconMoonStars size={20} color="#171c28" /> : <IconSunset2 size={25} />;
  }, [theme, systemTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={clsx(styles['theme'])}>
      <ActionIcon
        size={60}
        radius={60}
        variant="filled"
        onClick={handleClick}
        color="var(--text-color)"
        bd="2px dashed var(--btn-bg)"
      >
        {icon}
      </ActionIcon>
    </div>
  );
}

export default AppThemeToggle;
