/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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