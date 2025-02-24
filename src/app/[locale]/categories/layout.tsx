import AppFooter from '@/components/AppFooter';
import AppHeader from '@/components/AppHeader';

function ForbiddenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
}

export const generateMetadata = () => {
  return {
    title: 'Mocca Cafe | Categories',
  };
};

export default ForbiddenLayout;
