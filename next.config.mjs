// next.config.mjs
import i18nConfig from './next-i18next.config.js'; // Import the default export
const { i18n } = i18nConfig; // Destructure to get `i18n`

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n, // Use the `i18n` configuration
};

export default nextConfig;
