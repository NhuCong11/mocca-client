function ForbiddenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export const generateMetadata = () => {
  return {
    title: 'Mocca Cafe | Sign In',
  };
};

export default ForbiddenLayout;
