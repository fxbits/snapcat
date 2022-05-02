/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['lh3.googleusercontent.com', 's.gravatar.com'],
  },
  i18n
};
