// next.config.js
const { i18n } = require('./next-i18next.config.js'); // Import i18n configuration from next-i18next.config.js

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Optional, if you're using the app directory
  },
  i18n, // Apply the i18n config here
};

module.exports = nextConfig;
