/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      // Add polyfills for TextEncoder/TextDecoder
      util: false,
      crypto: false,
      stream: false,
      buffer: false
    };
    
    // Prevent face-api from being included in server-side bundles
    if (isServer) {
      config.externals = [...config.externals, '@vladmandic/face-api'];
    }
    
    return config;
  }
};

module.exports = nextConfig;