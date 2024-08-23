"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { NFT } from '../types/nft';
import { fishingGameApi } from '../api/blockchain/fishinGameApi';
import getFishingGameChromiaClient from '../lib/fishingGameChromiaClient';
import FishingGame from './FishingGame';
import { Session } from '@chromia/ft4';
import { useSessionContext } from './ContextProvider';

export default function GameContent() {
  const { sessions } = useSessionContext();
  const [session, setSession] = useState<Session | undefined>();

  const [nft, setNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSession = async () => {
      console.log("Fetching session");
      const client = await getFishingGameChromiaClient();
      const fishingGameSession = sessions[client.config.blockchainRid.toUpperCase()];
      setSession(fishingGameSession);
    };

    fetchSession();
  }, [sessions]);

  useEffect(() => {
    const fetchNFT = async () => {
      if (!session) return;
      const tokenId = searchParams.get('tokenId');
      const project = searchParams.get('project');
      const collection = searchParams.get('collection');

      if (tokenId && collection && project) {
        try {
          const fetchedNFT = await fishingGameApi.getNFT(session, project, collection, parseInt(tokenId));
          if (fetchedNFT && fetchedNFT.metadata.yours.collection === collection) {
            setNFT(fetchedNFT);
          }
        } catch (error) {
          console.error("Error fetching NFT:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchNFT();
  }, [session, searchParams]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-white">Loading...</div>;
  }

  if (!session) {
    return <div className="container mx-auto px-4 py-8 text-white">Session not found.</div>;
  }

  if (!nft) {
    return <div className="container mx-auto px-4 py-8 text-white">NFT not found or not part of the Pudgy Penguin Collection.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 min-h-screen">
      <div className="bg-[var(--color-background)] rounded-lg shadow-md p-4 md:p-6">
        <FishingGame initialNFT={nft} session={session} />
      </div>
    </div>
  );
}