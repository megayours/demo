"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NFTCard from '../components/NFTCard';
import Spinner from '../components/Spinner';
import { megaYoursApi } from '../api/blockchain/megaYoursApi';
import { externalNFTApi } from '../api/blockchain/externalNFTApi';
import { useSessionContext } from '../components/ContextProvider';
import { bridgeNFT, bridgeNFTBack } from '../lib/crosschain';
import { fishingGameApi } from '../api/blockchain/fishinGameApi';
import getFishingGameChromiaClient from '../lib/fishingGameChromiaClient';
import { NFT, NFTMetadata } from '../types/nft';

function ImportNFT() {
  const [consolidatedNFTs, setConsolidatedNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  const { sessions } = useSessionContext();
  const session = sessions[1]; // Assuming Mega Chain has IID 1
  const router = useRouter();

  useEffect(() => {
    fetchNFTs();
  }, [session]);

  const fetchNFTs = async () => {
    if (session) {
      setIsLoading(true);
      try {
        const externalNFTs = await externalNFTApi.getNFTs();
        const megaYoursNFTs = await megaYoursApi.getNFTs(session);
        const fishingGameClient = await getFishingGameChromiaClient();

        console.log(`External NFTs: ${JSON.stringify(externalNFTs)}`);
        console.log(`Mega Yours NFTs: ${JSON.stringify(megaYoursNFTs)}`);

        const consolidated: NFT[] = [];

        // Process external NFTs (Ethereum)
        consolidated.push(...externalNFTs);

        // Process Mega Yours NFTs
        for (const nft of megaYoursNFTs) {
          const existingIndex = consolidated.findIndex(c => c.token_id === nft.token_id);
          if (existingIndex !== -1) {
            consolidated[existingIndex] = { metadata: nft.metadata, blockchain: nft.blockchain, token_id: nft.token_id, project: nft.project, collection: nft.collection };
          } else {
            consolidated.push(nft);
          }
        }

        // Process Fishing Game NFTs
        for (const nft of megaYoursNFTs) {
          const fishingNFT = await fishingGameApi.getNFT(fishingGameClient, nft.collection, nft.token_id);
          console.log(`Fishing Game NFT: ${JSON.stringify(fishingNFT)}`);
          if (fishingNFT) {
            const existingIndex = consolidated.findIndex(c => c.token_id === nft.token_id);
            if (existingIndex !== -1) {
              console.log("Updating NFT as Fishing one");
              consolidated[existingIndex] = { metadata: fishingNFT.metadata, blockchain: fishingNFT.blockchain, token_id: nft.token_id, project: nft.project, collection: nft.collection };
            }
          }
        }

        setConsolidatedNFTs(consolidated);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateNFT = (updatedNFT: NFT) => {
    setConsolidatedNFTs(prevNFTs => 
      prevNFTs.map(nft => 
        nft.token_id === updatedNFT.token_id ? updatedNFT : nft
      )
    );
  };

  const setActionLoading = (tokenId: number, action: string, isLoading: boolean) => {
    setLoadingActions(prev => ({
      ...prev,
      [`${tokenId}-${action}`]: isLoading
    }));
  };

  const importToken = async (project: string, collection: string, tokenId: number, nft: NFTMetadata) => {
    if (session) {
      setActionLoading(tokenId, 'import', true);
      try {
        await megaYoursApi.importNFT(session, project, collection, tokenId, nft);
        
        // Fetch the updated NFT data after import
        const updatedNFT = await megaYoursApi.getNFT(session, collection, tokenId);
        
        if (updatedNFT) {
          updateNFT(updatedNFT);
        } else {
          console.error("Failed to fetch updated NFT data after import");
        }
      } catch (error) {
        console.error("Error importing token:", error);
      } finally {
        setActionLoading(tokenId, 'import', false);
      }
    }
  };

  const bridgeTokenToFishingGame = async (collection: string, tokenId: number) => {
    if (session) {
      setActionLoading(tokenId, 'bridgeToFishing', true);
      try {
        await bridgeNFT(session, collection, tokenId, 2);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const fishingGameClient = await getFishingGameChromiaClient();
        const bridgedNFT = await fishingGameApi.getNFT(fishingGameClient, collection, tokenId);
        if (bridgedNFT) {
          updateNFT({ ...bridgedNFT, token_id: tokenId, collection });
        }
      } catch (error) {
        console.error("Error bridging token to Fishing Game:", error);
      } finally {
        setActionLoading(tokenId, 'bridgeToFishing', false);
      }
    }
  };

  const bridgeTokenFromFishingGame = async (collection: string, tokenId: number) => {
    if (session) {
      setActionLoading(tokenId, 'bridgeFromFishing', true);
      try {
        await bridgeNFTBack(session, collection, tokenId, 2);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const bridgedBackNFT = await megaYoursApi.getNFT(session, collection, tokenId);
        if (bridgedBackNFT) {
          updateNFT(bridgedBackNFT);
        }
      } catch (error) {
        console.error("Error bridging token from Fishing Game:", error);
      } finally {
        setActionLoading(tokenId, 'bridgeFromFishing', false);
      }
    }
  };

  const playGame = async (nft: NFT) => {
    router.push(`/game?collection=${nft.collection}&tokenId=${nft.token_id}`);
  };

  const getActions = (nft: NFT) => {
    const actions = [];
    if (nft.blockchain === "Ethereum") {
      actions.push({ 
        label: "Import", 
        onClick: () => importToken(nft.project, nft.collection, nft.token_id, nft.metadata),
        loading: loadingActions[`${nft.token_id}-import`] || false
      });
    } else if (nft.blockchain === "Mega Chain" && nft.token_id) {
      actions.push({
        label: "Transfer to Fishing Game",
        onClick: () => bridgeTokenToFishingGame(nft.collection, nft.token_id),
        loading: loadingActions[`${nft.token_id}-bridgeToFishing`] || false
      });
    } else if (nft.blockchain === "Fishing Game" && nft.token_id) {
      actions.push({
        label: "Transfer to Mega Chain",
        onClick: () => bridgeTokenFromFishingGame(nft.collection, nft.token_id),
        loading: loadingActions[`${nft.token_id}-bridgeFromFishing`] || false
      });
      if (nft.collection === "Pudgy Penguins") {
        actions.push({
          label: "Play",
          onClick: () => playGame(nft),
          loading: false
        });
      }
    }
    return actions;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {consolidatedNFTs.filter((nft) => nft?.metadata?.image).map((nft, index) => (
          <NFTCard
            key={`${nft.token_id}-${nft.blockchain}`}
            imageUrl={nft.metadata.image || ""}
            tokenName={nft.metadata.name}
            tokenDescription={nft.metadata.description}
            metadata={nft.metadata}
            actions={getActions(nft)}
            blockchain={nft.blockchain}
          />
        ))}
      </div>
    </div>
  );
}

export default ImportNFT;