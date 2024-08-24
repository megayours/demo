'use client';

import Link from 'next/link';

function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-center mb-8 rainbow-text">
        Welcome to MegaYours
      </h1>
      <p className="text-xl text-center mb-12 text-gray-300">
        Your gateway to the NFT universe
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">
            Explore NFTs
          </h2>
          <p className="text-gray-300 mb-4">
            Discover unique digital assets from various blockchains.
          </p>
          <Link href="/inventory" className="mega-button inline-block">
            View Inventory
          </Link>
        </div>
        <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-secondary)]">
            Create NFTs
          </h2>
          <p className="text-gray-300 mb-4">
            Mint your own NFTs and share them with the world.
          </p>
          <Link href="/create-nft" className="mega-button inline-block">
            Start Creating
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-4 rainbow-text">
          Join the MegaYours Community
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Connect, trade, and explore the future of digital ownership
        </p>
        <Link href="/import-module" className="mega-button inline-block">
          Join Discord
        </Link>
      </div>
    </div>
  );
}

export default Home;
