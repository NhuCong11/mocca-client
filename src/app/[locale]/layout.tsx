import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { fonts } from '@/styles/fonts';
import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/config';
import StoreProvider from '@/contexts/StoreProvider';
import LayoutProvider from '@/contexts/LayoutProvider';

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
