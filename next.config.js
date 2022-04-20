/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['lh3.googleusercontent.com', 's.gravatar.com'],
  },
};

module.exports = nextConfig;
