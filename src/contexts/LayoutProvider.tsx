'use client';
import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { MantineProvider } from '@mantine/core';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { theme } from '@/styles/mantine';
import AppFooter from '@/components/AppFooter';
import AppGoToTop from '@/components/AppGoToTop';

function LayoutProvider({ children }: { children: Readonly<React.ReactNode> }) {
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
        {children}
        <AppFooter />
        <AppGoToTop />
      </MantineProvider>
    </ThemeProvider>
  );
}

export default LayoutProvider;
