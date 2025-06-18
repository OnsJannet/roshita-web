// next.config.js
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  i18n,
  async headers() {
    return [
      {
        source: '/api/ws/notifications/patient/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
          { key: 'Upgrade', value: 'websocket' },
          { key: 'Connection', value: 'Upgrade' }
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
        ws: 'ws',
      });
    }
    return config;
  },
};

module.exports = nextConfig;