function PaymentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export const generateMetadata = () => {
  return {
    title: 'Mocca Cafe | Transfer',
  };
};

export default PaymentLayout;
