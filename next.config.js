/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
