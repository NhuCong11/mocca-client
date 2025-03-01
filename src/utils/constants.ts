export const FUN_EMOJIS = [
  '👾',
  '⭐',
  '🌟',
  '🎉',
  '🎊',
  '🎈',
  '🎁',
  '🎂',
  '🎄',
  '🎃',
  '🎗',
  '🎟',
  '🎫',
  '🎖',
  '🏆',
  '🏅',
  '🥇',
  '🥈',
  '🥉',
  '⚽',
  '🏀',
  '🏈',
  '⚾',
  '🎾',
  '🏐',
  '🏉',
  '🎱',
  '🏓',
  '🏸',
  '🥅',
  '🏒',
  '🏑',
  '🏏',
  '⛳',
  '🏹',
  '🎣',
  '🥊',
  '🥋',
  '🎽',
  '⛸',
  '🥌',
  '🛷',
  '🎿',
  '⛷',
  '🏂',
  '🏋️',
  '🤼',
  '🤸',
  '🤺',
  '⛹️',
  '🤾',
  '🏌️',
  '🏇',
  '🧘',
];

export const hostname = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.hauifood.com/';

export const hostnameGHN = process.env.NEXT_PUBLIC_API_GET_GHN || 'https://online-gateway.ghn.vn/shiip/public-api/';

export const clientID =
  process.env.NEXT_PUBLIC_CLIENT_ID || '668030350524-5i4q27bnfmgrr47311marb2m9t9jmt87.apps.googleusercontent.com';

export const getRandomEmoji = () => {
  return FUN_EMOJIS[Math.floor(Math.random() * FUN_EMOJIS.length)];
};

export const generateQRCodeImage = (email: string | undefined, secret: string) => {
  return email
    ? `${hostname}qr-code?uri=otpauth://totp/HaUI%20Food:%20${email}?secret=${secret}`
    : '${hostname}qr-code?uri=otpauth://totp/HaUI%20Food:%20';
};

export const getVNCurrency = (price: number) => `${price?.toLocaleString('vi-VN') || 0} ₫`;
export const getVNDate = (date: Date) => date?.toLocaleDateString('vi-VN') || '-/-/-';
