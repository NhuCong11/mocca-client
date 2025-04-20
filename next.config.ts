import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'img.vietqr.io',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'food-cms.grab.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'd1sag4ddilekf6.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'image.slidesdocs.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'p21-ad-sg.ibyteimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'indianakitchen.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'minhcaumart.vn',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'lavievn.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'api.mocca.io.vn',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'file.hauifood.com',
        pathname: '/**',
      },
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'api.mocca.io.vnqr-code',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
