export const listBanner = [
  '/images/banner/cafe03.jpeg',
  '/images/banner/cafe06.jpeg',
  '/images/banner/cafe04.jpg',
  '/images/banner/cafe05.jpg',
  '/images/banner/cafe07.jpeg',
];

export const getGreeting = (hours: number) => {
  if (hours >= 0 && hours <= 12) {
    return 'home-banner.heading01';
  } else if (hours > 12 && hours <= 18) {
    return 'home-banner.heading02';
  } else {
    return 'home-banner.heading03';
  }
};
