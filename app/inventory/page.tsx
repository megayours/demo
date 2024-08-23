"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NFTCard from '../components/NFTCard';
import Spinner from '../components/Spinner';
import { megaYoursApi } from '../api/blockchain/megaYoursApi';
import { externalNFTApi } from '../api/blockchain/externalNFTApi';
import { useSessionContext } from '../components/ContextProvider';
import { bridgeNFT } from '../lib/crosschain';
import { fishingGameApi } from '../api/blockchain/fishinGameApi';
import getFishingGameChromiaClient from '../lib/fishingGameChromiaClient';
import { NFT } from '../types/nft';
import Modal from '../components/Modal';
import getMegaYoursChromiaClient from '../lib/megaYoursChromiaClient';
import { Session } from '@chromia/ft4';
import { BLOCKCHAINS } from '../lib/constants';

function ImportNFT() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  const { sessions } = useSessionContext();
  const [megaChainSession, setMegaChainSession] = useState<Session | undefined>();
  const [fishingGameSession, setFishingGameSession] = useState<Session | undefined>();
  const router = useRouter();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      const megaClient = await getMegaYoursChromiaClient();
      const megaSession = sessions[megaClient.config.blockchainRid.toUpperCase()];
      setMegaChainSession(megaSession);

      const fishingClient = await getFishingGameChromiaClient();
      const fishingSession = sessions[fishingClient.config.blockchainRid.toUpperCase()];
      setFishingGameSession(fishingSession);
    };

    fetchSessions();
  }, [sessions]);

  useEffect(() => {
    if (megaChainSession && fishingGameSession) {
      refreshNFTs();
    }
  }, [megaChainSession, fishingGameSession]);

  const refreshNFTs = useCallback(async () => {
    setIsLoading(true);
    try {
      const megaYoursNFTs = megaChainSession ? await megaYoursApi.getNFTs(megaChainSession) : [];
      const fishingGameNFTs = fishingGameSession ? await fishingGameApi.getNFTs(fishingGameSession) : [];
      const externalNFTs = await externalNFTApi.getNFTs();

      const bridgedNfts = [...megaYoursNFTs, ...fishingGameNFTs];
      const filteredEthereumNFTs = externalNFTs.filter(nft => 
        !bridgedNfts.some(bridgedNft => sameToken(nft, bridgedNft))
      );

      setNfts([
        ...megaYoursNFTs,
        ...filteredEthereumNFTs,
        ...fishingGameNFTs
      ]);
    } catch (error) {
      console.error(`Error refreshing NFTs:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [megaChainSession, fishingGameSession]);

  const sameToken = (nft: NFT, existingNft: NFT) => {
    return nft.metadata.yours.project === existingNft.metadata.yours.project &&
      nft.metadata.yours.collection === existingNft.metadata.yours.collection &&
      nft.token_id === existingNft.token_id;
  };

  const updateNFT = useCallback((updatedNFT: NFT, fromBlockchain: string, toBlockchain: string) => {
    console.log(`updatedNFT: ${JSON.stringify(updatedNFT)}`);
    setNfts(prevNfts => {
      const newNfts = prevNfts.map(nft => {
        if (sameToken(nft, updatedNFT) && nft.blockchain === fromBlockchain) {
          console.log("Updating NFT from", fromBlockchain, "to", toBlockchain);
          return { ...updatedNFT, blockchain: toBlockchain };
        }
        return nft;
      });
      
      // If the NFT wasn't found and updated, add it to the array
      if (!newNfts.some(nft => sameToken(nft, updatedNFT) && nft.blockchain === toBlockchain)) {
        newNfts.push({ ...updatedNFT, blockchain: toBlockchain });
      }
      
      return newNfts;
    });
  }, []);

  const setActionLoading = (tokenId: number, action: string, isLoading: boolean) => {
    setLoadingActions(prev => ({
      ...prev,
      [`${tokenId}-${action}`]: isLoading
    }));
  };

  const bridgeToken = async (nft: NFT, targetBlockchain: string) => {
    setActionLoading(nft.token_id, 'bridge', true);
    try {
      if (nft.blockchain === BLOCKCHAINS.ETHEREUM && targetBlockchain === BLOCKCHAINS.MEGA_CHAIN) {
        await megaYoursApi.importNFT(megaChainSession!, nft.token_id, nft.metadata);
        const updatedNFT = await megaYoursApi.getNFT(megaChainSession!, nft.metadata.yours.project, nft.metadata.yours.collection, nft.token_id);
        if (updatedNFT) {
          updateNFT({ ...updatedNFT, blockchain: BLOCKCHAINS.ETHEREUM }, BLOCKCHAINS.ETHEREUM, BLOCKCHAINS.MEGA_CHAIN);
        }
      } else if (nft.blockchain === BLOCKCHAINS.MEGA_CHAIN && targetBlockchain === BLOCKCHAINS.FISHING_GAME) {
        await bridgeNFT(megaChainSession!, nft.metadata.yours.project, nft.metadata.yours.collection, nft.token_id, fishingGameSession!);
        const bridgedNFT = await fishingGameApi.getNFT(fishingGameSession!, nft.metadata.yours.project, nft.metadata.yours.collection, nft.token_id);
        console.log(`Bridged NFT: ${bridgedNFT?.token_id}@${bridgedNFT?.blockchain}`);
        if (bridgedNFT) {
          updateNFT({ ...bridgedNFT, blockchain: BLOCKCHAINS.MEGA_CHAIN }, BLOCKCHAINS.MEGA_CHAIN, BLOCKCHAINS.FISHING_GAME);
        }
      } else if (nft.blockchain === BLOCKCHAINS.FISHING_GAME && targetBlockchain === BLOCKCHAINS.MEGA_CHAIN) {
        await bridgeNFT(fishingGameSession, nft.metadata.yours.project, nft.metadata.yours.collection, nft.token_id, megaChainSession!);
        const bridgedBackNFT = await megaYoursApi.getNFT(megaChainSession!, nft.metadata.yours.project, nft.metadata.yours.collection, nft.token_id);
        console.log(`Bridged back NFT: ${JSON.stringify(bridgedBackNFT)}`);
        if (bridgedBackNFT) {
          updateNFT({ ...bridgedBackNFT, blockchain: BLOCKCHAINS.FISHING_GAME }, BLOCKCHAINS.FISHING_GAME, BLOCKCHAINS.MEGA_CHAIN);
        }
      }
    } catch (error) {
      console.error("Error bridging token:", error);
    } finally {
      setActionLoading(nft.token_id, 'bridge', false);
    }
  };

  const playGame = (nft: NFT) => {
    router.push(`/game?project=${nft.metadata.yours.project}&collection=${nft.metadata.yours.collection}&tokenId=${nft.token_id}`);
  };

  const handleBridge = (nft: NFT) => {
    console.log(`Handling bridge for ${JSON.stringify(nft)}`);
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNFT(null);
  };

  const executeBridge = async (targetBlockchain: string) => {
    if (!selectedNFT) return;
    closeModal();
    console.log(`Executing bridge to ${targetBlockchain} for ${JSON.stringify(selectedNFT)}`);
    await bridgeToken(selectedNFT, targetBlockchain);
  };

  const getActions = (nft: NFT) => {
    const actions = [];
    actions.push({ 
      label: "Bridge", 
      onClick: () => handleBridge(nft),
      loading: loadingActions[`${nft.token_id}-bridge`] || false
    });
    if (nft.blockchain === BLOCKCHAINS.FISHING_GAME && nft.metadata.yours.collection === "Pudgy Penguins") {
      actions.push({
        label: "Play",
        onClick: () => playGame(nft),
        loading: false
      });
    }
    return actions;
  };

  if (!megaChainSession || !fishingGameSession) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <p>Please connect to {BLOCKCHAINS.MEGA_CHAIN} and {BLOCKCHAINS.FISHING_GAME} to view your inventory.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your NFT Inventory</h1>
      
      {/* NFT grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        key={nfts.map(nft => `${nft.token_id}-${nft.blockchain}`).join(',')}
      >
        {nfts.map((nft) => (
          <NFTCard
            key={`${nft.token_id}-${nft.blockchain}`}
            imageUrl={nft.metadata.image || ""}
            tokenName={nft.metadata.name}
            tokenDescription={nft.metadata.description || ""}
            metadata={nft.metadata}
            actions={getActions(nft)}
            blockchain={nft.blockchain}
          />
        ))}
      </div>

      {/* Bridge Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedNFT && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Select a target blockchain</h2>
            <div className="space-y-2">
              {[BLOCKCHAINS.MEGA_CHAIN, BLOCKCHAINS.FISHING_GAME].map((blockchain) => (
                <button
                  key={blockchain}
                  className={`w-full py-2 px-4 rounded transition-all duration-200 ${
                    (selectedNFT.blockchain === BLOCKCHAINS.ETHEREUM && blockchain !== BLOCKCHAINS.MEGA_CHAIN) ||
                    (selectedNFT.blockchain === BLOCKCHAINS.MEGA_CHAIN && blockchain !== BLOCKCHAINS.FISHING_GAME) ||
                    (selectedNFT.blockchain === BLOCKCHAINS.FISHING_GAME && blockchain !== BLOCKCHAINS.MEGA_CHAIN)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => executeBridge(blockchain)}
                  disabled={
                    (selectedNFT.blockchain === BLOCKCHAINS.ETHEREUM && blockchain !== BLOCKCHAINS.MEGA_CHAIN) ||
                    (selectedNFT.blockchain === BLOCKCHAINS.MEGA_CHAIN && blockchain !== BLOCKCHAINS.FISHING_GAME) ||
                    (selectedNFT.blockchain === BLOCKCHAINS.FISHING_GAME && blockchain !== BLOCKCHAINS.MEGA_CHAIN)
                  }
                >
                  {blockchain}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ImportNFT;