import type { NextConfig } from 'next';
const config: NextConfig = {
  ...(process.env.GW1_STATIC_EXPORT === '1' ? { output: 'export' as const } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default config;
