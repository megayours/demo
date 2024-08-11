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
import Modal from '../components/Modal';
import getMegaYoursChromiaClient from '../lib/megaYoursChromiaClient';
import { Session } from '@chromia/ft4';

function ImportNFT() {
  const [consolidatedNFTs, setConsolidatedNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  const { sessions } = useSessionContext();
  const [session, setSession] = useState<Session | undefined>();
  const router = useRouter();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const client = await getMegaYoursChromiaClient();
      const megaChainSession = sessions[client.config.blockchainRid.toUpperCase()];
      setSession(megaChainSession);
    };

    fetchSession();
  }, [sessions]);

  useEffect(() => {
    if (session) {
      fetchNFTs();
    }
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
          const fishingNFT = await fishingGameApi.getNFT(fishingGameClient, nft.project, nft.collection, nft.token_id);
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
        const updatedNFT = await megaYoursApi.getNFT(session, project, collection, tokenId);
        
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

  const bridgeTokenToFishingGame = async (project: string, collection: string, tokenId: number) => {
    if (session) {
      setActionLoading(tokenId, 'bridgeToFishing', true);
      try {
        const fishingGameClient = await getFishingGameChromiaClient();
        await bridgeNFT(session, project, collection, tokenId, fishingGameClient.config.blockchainRid);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const bridgedNFT = await fishingGameApi.getNFT(fishingGameClient, project, collection, tokenId);
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

  const bridgeTokenFromFishingGame = async (project: string, collection: string, tokenId: number) => {
    if (session) {
      setActionLoading(tokenId, 'bridgeFromFishing', true);
      try {
        const client = await getFishingGameChromiaClient();
        await bridgeNFTBack(session, project, collection, tokenId, client.config.blockchainRid);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const bridgedBackNFT = await megaYoursApi.getNFT(session, project, collection, tokenId);
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
    router.push(`/game?project=${nft.project}&collection=${nft.collection}&tokenId=${nft.token_id}`);
  };

  const handleBridge = (nft: NFT) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNFT(null);
  };

  const executeBridge = async (targetBlockchain: string) => {
    if (!selectedNFT) return;
    
    // Close the modal immediately
    closeModal();
    
    // Set the bridging NFT and start the process
    setActionLoading(selectedNFT.token_id, 'bridge', true);

    try {
      if (selectedNFT.blockchain === "Ethereum" && targetBlockchain === "Mega Chain") {
        await importToken(selectedNFT.project, selectedNFT.collection, selectedNFT.token_id, selectedNFT.metadata);
      } else if (selectedNFT.blockchain === "Mega Chain" && targetBlockchain === "Fishing Game") {
        await bridgeTokenToFishingGame(selectedNFT.project, selectedNFT.collection, selectedNFT.token_id);
      } else if (selectedNFT.blockchain === "Fishing Game" && targetBlockchain === "Mega Chain") {
        await bridgeTokenFromFishingGame(selectedNFT.project, selectedNFT.collection, selectedNFT.token_id);
      }
    } catch (error) {
      console.error("Error bridging token:", error);
      // Handle error (e.g., show error message)
    } finally {
      setActionLoading(selectedNFT.token_id, 'bridge', false);
    }
  };

  const getActions = (nft: NFT) => {
    const actions = [];
    actions.push({ 
      label: "Bridge", 
      onClick: () => handleBridge(nft),
      loading: loadingActions[`${nft.token_id}-bridge`] || false
    });
    if (nft.blockchain === "Fishing Game" && nft.collection === "Pudgy Penguins") {
      actions.push({
        label: "Play",
        onClick: () => playGame(nft),
        loading: false
      });
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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedNFT && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Select a target blockchain</h2>
            <div className="space-y-2">
              <button
                className={`w-full py-2 px-4 rounded transition-all duration-200 ${
                  selectedNFT.blockchain !== "Ethereum"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => executeBridge("Mega Chain")}
                disabled={selectedNFT.blockchain !== "Ethereum"}
              >
                Mega Chain
              </button>
              <button
                className={`w-full py-2 px-4 rounded transition-all duration-200 ${
                  selectedNFT.blockchain !== "Mega Chain"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                onClick={() => executeBridge("Fishing Game")}
                disabled={selectedNFT.blockchain !== "Mega Chain"}
              >
                Fishing Game
              </button>
              <button
                className={`w-full py-2 px-4 rounded transition-all duration-200 ${
                  selectedNFT.blockchain !== "Fishing Game"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
                onClick={() => executeBridge("Mega Chain")}
                disabled={selectedNFT.blockchain !== "Fishing Game"}
              >
                Mega Chain
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ImportNFT;