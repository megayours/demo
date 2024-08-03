/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/demo/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/demo' : '',
  env: {
    NEXT_PUBLIC_D1_NODE_URL_POOL: process.env.NEXT_PUBLIC_D1_NODE_URL_POOL,
    NEXT_PUBLIC_MEGA_CHAIN_BLOCKCHAIN_RID: process.env.NEXT_PUBLIC_MEGA_CHAIN_BLOCKCHAIN_RID,
    NEXT_PUBLIC_GAME_CHAIN_BLOCKCHAIN_RID: process.env.NEXT_PUBLIC_GAME_CHAIN_BLOCKCHAIN_RID,
  },
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