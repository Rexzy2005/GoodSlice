import type { NextConfig } from 'next';
const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@slyce/shared'],
  async headers() {
    return [{ source: '/sw.js', headers: [
      { key: 'Cache-Control', value: 'no-store' },
      { key: 'Service-Worker-Allowed', value: '/' },
    ] }];
  },
};
export default config;
