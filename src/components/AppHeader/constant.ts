import { IconLogout, IconShoppingCart, IconUser } from '@tabler/icons-react';

export const getUserOptions = (
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>,
  setShowUserOptions: React.Dispatch<React.SetStateAction<boolean>>,
  handleLogOut: () => void,
) => [
  {
    href: '/auth/profile',
    label: 'user-options.op01',
    Icon: IconUser,
    onClick: function toggleProfile() {
      setShowUserOptions(false);
    },
  },
  {
    onClick: function toggleCart() {
      setShowCart((prev) => !prev);
      setShowUserOptions(false);
    },
    label: 'cart.title02',
    Icon: IconShoppingCart,
    isMd: true,
  },
  {
    onClick: handleLogOut,
    label: 'user-options.op02',
    Icon: IconLogout,
  },
];
