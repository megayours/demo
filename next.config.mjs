/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/demo/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/demo' : '',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'api.pudgypenguins.io',
        port: '',
        pathname: '/present/**',
      }
    ],
  },
};

export default nextConfig;