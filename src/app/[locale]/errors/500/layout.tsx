function ForbiddenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export const generateMetadata = () => {
  return {
    title: 'Mocca Cafe | Server error 500',
  };
};

export default ForbiddenLayout;
