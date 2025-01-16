function ForbiddenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export const generateMetadata = () => {
  return {
    title: 'Mocca Cafe | Forbidden 403',
  };
};

export default ForbiddenLayout;
