"use client";

import { useState, useEffect } from 'react';
import NFTCard from '../components/NFTCard';
import { megaYoursApi } from '../api/blockchain/megaYoursApi';
import { externalNFTApi } from '../api/blockchain/externalNFTApi';
import { useSessionContext } from '../components/ContextProvider';
import { bridgeNFT } from '../lib/crosschain';
import { fishingGameApi } from '../api/blockchain/fishinGameApi';
import getFishingGameChromiaClient from '../lib/fishingGameChromiaClient';
import { NFT, NFTMetadata } from '../types/nft';

function ImportNFT() {
  const [consolidatedNFTs, setConsolidatedNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSessionContext();

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
            consolidated[existingIndex] = { metadata: nft.metadata, blockchain: nft.blockchain, token_id: nft.token_id };
          } else {
            consolidated.push(nft);
          }
        }

        // Process Fishing Game NFTs
        for (const nft of megaYoursNFTs) {
          const fishingNFT = await fishingGameApi.getNFT(fishingGameClient, nft.token_id);
          console.log(`Fishing Game NFT: ${JSON.stringify(fishingNFT)}`);
          if (fishingNFT) {
            const existingIndex = consolidated.findIndex(c => c.token_id === nft.token_id);
            if (existingIndex !== -1) {
              console.log("Updating NFT as Fishing one");
              consolidated[existingIndex] = { metadata: fishingNFT.metadata, blockchain: fishingNFT.blockchain, token_id: nft.token_id };
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

  const importToken = async (tokenId: number, nft: NFTMetadata) => {
    if (session) {
      try {
        await megaYoursApi.importNFT(session, tokenId, nft);
        await fetchNFTs();
      } catch (error) {
        console.error("Error importing token:", error);
      }
    }
  };

  const bridgeTokenToFishingGame = async (tokenId: number) => {
    if (session) {
      try {
        await bridgeNFT(session, tokenId);
        // Wait for a short period to allow the blockchain to process the transaction
        await new Promise(resolve => setTimeout(resolve, 5000));
        await fetchNFTs();
      } catch (error) {
        console.error("Error bridging token to Fishing Game:", error);
      }
    }
  };

  const getActions = (nft: NFT) => {
    const actions = [];
    // console.log(`NFT: ${JSON.stringify(nft)}`);
    if (nft.blockchain === "Ethereum") {
      actions.push({ label: "Import", onClick: () => importToken(nft.token_id, nft.metadata) });
    } else if (nft.blockchain === "Mega Chain" && nft.token_id) {
      actions.push({
        label: "Transfer to Fishing Game",
        onClick: () => bridgeTokenToFishingGame(nft.token_id)
      });
    }
    return actions;
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {consolidatedNFTs.filter((nft) => nft?.metadata?.image).map((nft, index) => (
          <NFTCard
            key={index}
            imageUrl={nft.metadata.image || ""}
            tokenName={nft.metadata.name}
            tokenDescription={nft.metadata.description}
            actions={getActions(nft)}
            blockchain={nft.blockchain}
          />
        ))}
      </div>
    </div>
  );
}

export default ImportNFT;