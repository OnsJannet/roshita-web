/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      GOOGLE_TRANSLATION_CONFIG: JSON.stringify({
        languages: [
          { title: "English", name: "en" },
          { title: "Arabic", name: "ar" },
          { title: "Français", name: "fr" },
        ],
        defaultLanguage: "en",
      }),
    },
  };
  
  module.exports = nextConfig;