/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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