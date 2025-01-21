import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import { fonts } from '@/styles/fonts';
import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/config';
import StoreProvider from '@/contexts/StoreProvider';
import LayoutProvider from '@/contexts/LayoutProvider';

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();

  const title =
    typeof messages['title'] === 'string' ? messages['title'] : 'Mocca Cafe | Ứng dụng đặt mua Cafe đa dạng';
  const description =
    typeof messages['description'] === 'string'
      ? messages['description']
      : 'Ứng dụng đặt mua Cafe đa dạng được tạo bởi Công';

  return {
    title,
    description,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${fonts.lora} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
