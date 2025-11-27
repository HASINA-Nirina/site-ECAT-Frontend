/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
      protocol: 'http',
      hostname: '127.0.0.1',
      port: '8000',
      pathname: '/uploads/**',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '8000',
      pathname: '/uploads/**',
    },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000', // Le port doit correspondre à votre serveur API
        pathname: '**', // Permet n'importe quel chemin après le port
      },
      
    ],
  },
};

module.exports = nextConfig;
