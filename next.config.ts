import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

// Activer le bundle analyzer seulement si ANALYZE=true
const isAnalyze = process.env.ANALYZE === 'true';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true, // <--- ignore les erreurs ESLint pendant build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  devIndicators: false
};

export default withBundleAnalyzer({
  enabled: isAnalyze,
})(nextConfig);
