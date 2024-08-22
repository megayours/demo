"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NFTCard from '../components/NFTCard';
import Spinner from '../components/Spinner';
import { megaYoursApi } from '../api/blockchain/megaYoursApi';
import { externalNFTApi } from '../api/blockchain/externalNFTApi';
import { useSessionContext } from '../components/ContextProvider';
import { bridgeNFT, bridgeNFTBack } from '../lib/crosschain';
import { fishingGameApi } from '../api/blockchain/fishinGameApi';
import getFishingGameChromiaClient from '../lib/fishingGameChromiaClient';
import { NFT, TokenMetadata } from '../types/nft';
import Modal from '../components/Modal';
import getMegaYoursChromiaClient from '../lib/megaYoursChromiaClient';
import { Session } from '@chromia/ft4';
import { createSession } from '../lib/auth';
import debounce from 'lodash/debounce';

function ImportNFT() {
  const [megaChainNFTs, setMegaChainNFTs] = useState<NFT[]>([]);
  const [ethereumNFTs, setEthereumNFTs] = useState<NFT[]>([]);
  const [fishingGameNFTs, setFishingGameNFTs] = useState<NFT[]>([]);
  const [bridgedNFTs, setBridgedNFTs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'megaChain' | 'ethereum' | 'fishingGame'>('megaChain');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  const { sessions, setSession } = useSessionContext();
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

  const debouncedRefresh = useCallback(
    debounce(() => refreshActiveTabTokens(), 300),
    [megaChainSession, fishingGameSession]
  );

  useEffect(() => {
    if (megaChainSession) {
      debouncedRefresh();
    }
  }, [activeTab, megaChainSession, fishingGameSession, debouncedRefresh]);

  const refreshActiveTabTokens = async () => {
    setIsLoading(true);
    try {
      // Always fetch Mega Chain and Fishing Game NFTs to keep bridgedNFTs up-to-date
      if (megaChainSession) {
        const megaYoursNFTs = await megaYoursApi.getNFTs(megaChainSession);
        setMegaChainNFTs(megaYoursNFTs);
        updateBridgedNFTs(megaYoursNFTs);
      }
  
      if (fishingGameSession) {
        const fishingGameClient = await getFishingGameChromiaClient();
        const fishingGameTokens = await fishingGameApi.getNFTs(fishingGameClient, fishingGameSession.account.id);
        setFishingGameNFTs(fishingGameTokens);
        updateBridgedNFTs(fishingGameTokens);
      } else if (activeTab === 'fishingGame') {
        await authenticateFishingGame();
      }
  
      // Fetch and filter Ethereum NFTs
      if (activeTab === 'ethereum') {
        const externalNFTs = await externalNFTApi.getNFTs();
        const filteredEthereumNFTs = externalNFTs.filter(nft => 
          !bridgedNFTs.has(`${nft.metadata.yours.project}-${nft.metadata.yours.collection}-${nft.token_id}`)
        );
        setEthereumNFTs(filteredEthereumNFTs);
      }
    } catch (error) {
      console.error(`Error refreshing tokens:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBridgedNFTs = (nfts: NFT[]) => {
    setBridgedNFTs(prev => {
      const newBridgedNFTs = new Set(prev);
      nfts.forEach(nft => {
        newBridgedNFTs.add(`${nft.metadata.yours.project}-${nft.metadata.yours.collection}-${nft.token_id}`);
      });
      return newBridgedNFTs;
    });
  };

  const authenticateFishingGame = async () => {
    const fishingClient = await getFishingGameChromiaClient();
    const { session, logout } = await createSession();
    if (session) {
      setSession(fishingClient.config.blockchainRid, session, logout);
      setFishingGameSession(session);
      await refreshActiveTabTokens(); // Refresh tokens after authentication
    }
  };

  const updateNFT = (updatedNFT: NFT) => {
    if (updatedNFT.blockchain === 'Mega Chain') {
      setMegaChainNFTs(prevNFTs => {
        const existingIndex = prevNFTs.findIndex(nft => nft.token_id === updatedNFT.token_id);
        if (existingIndex !== -1) {
          return prevNFTs.map(nft => nft.token_id === updatedNFT.token_id ? updatedNFT : nft);
        } else {
          return [...prevNFTs, updatedNFT];
        }
      });
      setFishingGameNFTs(prevNFTs => prevNFTs.filter(nft => nft.token_id !== updatedNFT.token_id));
    } else if (updatedNFT.blockchain === 'Ethereum') {
      setEthereumNFTs(prevNFTs => {
        const existingIndex = prevNFTs.findIndex(nft => nft.token_id === updatedNFT.token_id);
        if (existingIndex !== -1) {
          return prevNFTs.map(nft => nft.token_id === updatedNFT.token_id ? updatedNFT : nft);
        } else {
          return [...prevNFTs, updatedNFT];
        }
      });
      setBridgedNFTs(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${updatedNFT.metadata.yours.project}-${updatedNFT.metadata.yours.collection}-${updatedNFT.token_id}`);
        return newSet;
      });
    } else if (updatedNFT.blockchain === 'Fishing Game') {
      setFishingGameNFTs(prevNFTs => {
        const existingIndex = prevNFTs.findIndex(nft => nft.token_id === updatedNFT.token_id);
        if (existingIndex !== -1) {
          return prevNFTs.map(nft => nft.token_id === updatedNFT.token_id ? updatedNFT : nft);
        } else {
          return [...prevNFTs, updatedNFT];
        }
      });
      setMegaChainNFTs(prevNFTs => prevNFTs.filter(nft => nft.token_id !== updatedNFT.token_id));
    }
    
    // Always update bridgedNFTs set
    setBridgedNFTs(prev => new Set(prev).add(`${updatedNFT.metadata.yours.project}-${updatedNFT.metadata.yours.collection}-${updatedNFT.token_id}`));
    
    // Always remove from Ethereum NFTs
    setEthereumNFTs(prevNFTs => prevNFTs.filter(nft => nft.token_id !== updatedNFT.token_id));
    
    // After updating the NFT, refresh the active tab
    refreshActiveTabTokens();
  };

  const setActionLoading = (tokenId: number, action: string, isLoading: boolean) => {
    setLoadingActions(prev => ({
      ...prev,
      [`${tokenId}-${action}`]: isLoading
    }));
  };

  const importToken = async (project: string, collection: string, tokenId: number, metadata: TokenMetadata) => {
    if (megaChainSession) {
      setActionLoading(tokenId, 'import', true);
      try {
        await megaYoursApi.importNFT(megaChainSession, tokenId, metadata);
        
        // Fetch the updated NFT data after import
        const updatedNFT = await megaYoursApi.getNFT(megaChainSession, project, collection, tokenId);
        
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
    if (megaChainSession && fishingGameSession) {
      setActionLoading(tokenId, 'bridgeToFishing', true);
      try {
        const fishingGameClient = await getFishingGameChromiaClient();
        await bridgeNFT(megaChainSession, project, collection, tokenId, fishingGameClient.config.blockchainRid);
        
        // Remove from Mega Chain NFTs immediately
        setMegaChainNFTs(prevNFTs => prevNFTs.filter(nft => nft.token_id !== tokenId));
  
        // Retry fetching the bridged NFT with exponential backoff
        const maxRetries = 5;
        const baseDelay = 2000; // 2 seconds
        let bridgedNFT = null;
  
        for (let i = 0; i < maxRetries; i++) {
          await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, i)));
          
          try {
            bridgedNFT = await fishingGameApi.getNFT(fishingGameSession, project, collection, tokenId);
            if (bridgedNFT) break;
          } catch (error) {
            console.log(`Attempt ${i + 1} failed to fetch bridged NFT. Retrying...`);
          }
        }
  
        if (bridgedNFT) {
          // Update Fishing Game NFTs
          updateNFT({ ...bridgedNFT, blockchain: 'Fishing Game' });
        } else {
          console.error("Failed to fetch bridged NFT data from Fishing Game after multiple attempts");
          // Add a placeholder NFT to Fishing Game NFTs
          const placeholderNFT: NFT = {
            token_id: tokenId,
            blockchain: 'Fishing Game',
            metadata: {
              properties: {},
              yours: { modules: [], project, collection },
              name: `Bridged NFT ${tokenId}`,
              description: 'NFT data is being synced...',
              image: '/placeholder-image.png', // Add a placeholder image
            }
          };
          updateNFT(placeholderNFT);
        }
      } catch (error) {
        console.error("Error bridging token to Fishing Game:", error);
      } finally {
        setActionLoading(tokenId, 'bridgeToFishing', false);
      }
    }
  };

  const bridgeTokenFromFishingGame = async (project: string, collection: string, tokenId: number) => {
    if (megaChainSession && fishingGameSession) {
      setActionLoading(tokenId, 'bridgeFromFishing', true);
      try {
        const client = await getFishingGameChromiaClient();
        await bridgeNFTBack(fishingGameSession, project, collection, tokenId, client.config.blockchainRid);
        
        // Wait for a short period to ensure the bridging operation is complete
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Fetch the bridged back NFT from Mega Chain
        const bridgedBackNFT = await megaYoursApi.getNFT(megaChainSession, project, collection, tokenId);
        if (bridgedBackNFT) {
          // Update Mega Chain NFTs
          updateNFT({ ...bridgedBackNFT, blockchain: 'Mega Chain' });
          
          // Remove from Fishing Game NFTs
          setFishingGameNFTs(prevNFTs => prevNFTs.filter(nft => nft.token_id !== tokenId));
        } else {
          console.error("Failed to fetch bridged back NFT data from Mega Chain");
        }
      } catch (error) {
        console.error("Error bridging token from Fishing Game:", error);
      } finally {
        setActionLoading(tokenId, 'bridgeFromFishing', false);
      }
    }
  };

  const playGame = async (nft: NFT) => {
    router.push(`/game?project=${nft.metadata.yours.project}&collection=${nft.metadata.yours.collection}&tokenId=${nft.token_id}`);
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

    console.log("Bridging: ", JSON.stringify(selectedNFT));
    
    // Close the modal immediately
    closeModal();
    
    // Set the bridging NFT and start the process
    setActionLoading(selectedNFT.token_id, 'bridge', true);

    try {
      if (selectedNFT.blockchain === "Ethereum" && targetBlockchain === "Mega Chain") {
        await importToken(selectedNFT.metadata.yours.project, selectedNFT.metadata.yours.collection, selectedNFT.token_id, selectedNFT.metadata);
      } else if (selectedNFT.blockchain === "Mega Chain" && targetBlockchain === "Fishing Game") {
        await bridgeTokenToFishingGame(selectedNFT.metadata.yours.project, selectedNFT.metadata.yours.collection, selectedNFT.token_id);
      } else if (selectedNFT.blockchain === "Fishing Game" && targetBlockchain === "Mega Chain") {
        await bridgeTokenFromFishingGame(selectedNFT.metadata.yours.project, selectedNFT.metadata.yours.collection, selectedNFT.token_id);
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
    if (nft.blockchain === "Fishing Game" && nft.metadata.yours.collection === "Pudgy Penguins") {
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
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'megaChain' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('megaChain')}
          >
            Mega Chain
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'ethereum' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('ethereum')}
          >
            Ethereum
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'fishingGame' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('fishingGame')}
          >
            Fishing Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'megaChain' && megaChainNFTs.map((nft) => (
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
        {activeTab === 'ethereum' && ethereumNFTs.map((nft) => (
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
        {activeTab === 'fishingGame' && fishingGameNFTs.map((nft) => (
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