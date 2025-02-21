'use client';
import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { MantineProvider } from '@mantine/core';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster } from 'react-hot-toast';

import { theme } from '@/styles/mantine';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import AppGoToTop from '@/components/AppGoToTop';
import { defaultLayoutRoutes } from '@/config/routes';
import { usePathname } from '@/i18n/routing';
import AppThemeToggle from '@/components/AppThemeToggle';

function LayoutProvider({ children }: { children: Readonly<React.ReactNode> }) {
  const pathName = usePathname();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: 'linear',
    });
  }, []);

  useEffect(() => {
    const detectDevTools = () => {
      console.log('%cĐịnh phá web của anh à 😒!', 'color: red; font-size: 20px; cursor: pointer;');
      console.log(
        '%cCần gì liên hệ anh 😉 facebook.com/Nhu.Cong1123',
        'color: blue; font-size: 14px; cursor: pointer;',
      );
    };
    detectDevTools();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        {defaultLayoutRoutes.includes(pathName) && <AppHeader />}
        {children}
        {defaultLayoutRoutes.includes(pathName) && <AppFooter />}
        <AppThemeToggle />
        <AppGoToTop />
        <Toaster
          gutter={8}
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            removeDelay: 1000,
            style: {
              borderRadius: '12px',
              background: 'var(--white)',
              color: 'var(--coffee-color-v2)',
              border: '1px solid var(--primary-bg)',
            },
          }}
        />
      </MantineProvider>
    </ThemeProvider>
  );
}

export default LayoutProvider;
