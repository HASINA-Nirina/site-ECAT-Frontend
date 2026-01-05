import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const isAnalyze = process.env.ANALYZE === 'true';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const apiHost = API_URL.replace(/^https?:\/\//, "").split(":")[0];
const apiProtocol = API_URL.startsWith("https") ? "https" : "http";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: apiProtocol as any,
        hostname: apiHost,
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1', // Ajout de l'IP pour éviter l'erreur de hostname
        port: '8000',
        pathname: '/**',
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