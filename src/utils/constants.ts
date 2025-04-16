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

export const hostname = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.mocca.io.vn';

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

export const getVNCurrency = (price: number | undefined) => `${price?.toLocaleString('vi-VN') || 0} ₫`;
export const getVNDate = (date: Date) => date?.toLocaleDateString('vi-VN') || '-/-/-';

export const formatDateTime = (dateTimeString: string, enough?: boolean, isoString?: boolean): string => {
  let dateTime = new Date(dateTimeString);

  if (isNaN(dateTime.getTime())) {
    dateTime = new Date();
  }
  // Lấy các thành phần ngày tháng năm, giờ, phút, giây
  const year = dateTime.getFullYear();
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
  const day = dateTime.getDate().toString().padStart(2, '0');
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');
  const seconds = dateTime.getSeconds().toString().padStart(2, '0');

  if (enough) {
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  if (isoString) {
    return `${year}-${month}-${day}`;
  } else {
    return `${day}/${month}/${year}`;
  }
};
