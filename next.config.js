const { createSecureHeaders } = require('next-secure-headers');
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders(),
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/work/presumi',
        destination: '/blog/presumi',
        permanent: true,
      },
      {
        source: '/thoughts/presumi',
        destination: '/blog/presumi',
        permanent: true,
      },
      {
        source: '/presumi',
        destination: '/blog/presumi',
        permanent: true,
      },
      {
        source: '/awards',
        destination: '/',
        permanent: true,
      },
      {
        source: '/contact',
        destination: 'https://twitter.com/haydenbleasel',
        permanent: true,
      },
      {
        source: '/blog/jellypepper',
        destination: '/work/jellypepper',
        permanent: true,
      },
      {
        source: '/journal/how-to-growth-hack-your-resume',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

const pwaConfig = {
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    dynamicStartUrl: false,
    mode: process.env.NODE_ENV,
  },
};

module.exports = withPlugins([[withPWA, pwaConfig]], nextConfig);
