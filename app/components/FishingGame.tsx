import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fishingGameApi } from '../api/blockchain/fishinGameApi';
import getFishingGameChromiaClient from '../lib/fishingGameChromiaClient';
import NFTCard from './NFTCard';
import FishingRodList from './FishingRodList';
import { NFT } from '../types/nft';

const FishingGame: React.FC<{ initialNFT: NFT }> = ({ initialNFT }) => {
  const [nft, setNFT] = useState<NFT>(initialNFT);
  const [fishingRods, setFishingRods] = useState<NFT[]>([]);
  const [selectedRod, setSelectedRod] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFishing, setIsFishing] = useState(false);
  const [splashEffect, setSplashEffect] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const fetchFishingRods = async () => {
      try {
        const fishingGameClient = await getFishingGameChromiaClient();
        const rods = await fishingGameApi.getPudgyRods(fishingGameClient);
        const rodNFTs = await Promise.all(
          rods.map(rod => fishingGameApi.getNFT(fishingGameClient, initialNFT.project, 'Pudgy Rods', rod.id))
        );
        const filteredRods = rodNFTs.filter((rod): rod is NFT => rod !== undefined);
        setFishingRods(filteredRods);

        // Check if a rod is already equipped
        const equippedRodAttr = nft.metadata.attributes.find(attr => attr.trait_type === "Fishing Rod");
        if (equippedRodAttr) {
          const equippedRod = filteredRods.find(rod => rod.metadata.name === equippedRodAttr.value);
          if (equippedRod) {
            setSelectedRod(equippedRod.token_id);
          }
        }
      } catch (error) {
        console.error("Error fetching Fishing Rods:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFishingRods();
  }, [nft.metadata.attributes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sky
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw water
      ctx.fillStyle = '#4FA1E2';
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      // Draw waves
      ctx.strokeStyle = '#3D8BD9';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.6 + i * 0.05));
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.lineTo(
            x,
            canvas.height * (0.6 + i * 0.05) + Math.sin(x * 0.03 + Date.now() * 0.002) * 5
          );
        }
        ctx.stroke();
      }

      // Draw fishing line
      if (selectedRod !== null) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height * 0.3);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
      }

      // Draw splash effect
      if (splashEffect.active) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(splashEffect.x, splashEffect.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw cursor
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mousePos.x - 15, mousePos.y);
      ctx.lineTo(mousePos.x + 15, mousePos.y);
      ctx.moveTo(mousePos.x, mousePos.y - 15);
      ctx.lineTo(mousePos.x, mousePos.y + 15);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedRod, mousePos, splashEffect]);

  const refreshNFTMetadata = async () => {
    try {
      const fishingGameClient = await getFishingGameChromiaClient();
      const updatedNFT = await fishingGameApi.getNFT(fishingGameClient, nft.project, nft.collection, nft.token_id);
      if (updatedNFT) {
        setNFT(updatedNFT);
      }

      // Refresh fishing rod metadata
      const updatedRods = await Promise.all(
        fishingRods.map(rod => fishingGameApi.getNFT(fishingGameClient, nft.project, 'Pudgy Rods', rod.token_id))
      );
      setFishingRods(updatedRods.filter((rod): rod is NFT => rod !== undefined));
    } catch (error) {
      console.error("Error refreshing NFT metadata:", error);
    }
  };

  const handleRodClick = async (rodId: number) => {
    try {
      const client = await getFishingGameChromiaClient();
      if (selectedRod === rodId) {
        await fishingGameApi.unequipRod(client, nft.token_id);
        setSelectedRod(null);
      } else {
        await fishingGameApi.equipRod(client, nft.token_id, rodId);
        setSelectedRod(rodId);
      }
      await refreshNFTMetadata();
    } catch (error) {
      console.error("Error equipping/unequipping rod:", error);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleCanvasClick = () => {
    if (selectedRod !== null && !isFishing) {
      setIsFishing(true);
      setSplashEffect({ x: mousePos.x, y: mousePos.y, active: true });

      setTimeout(() => {
        setSplashEffect((prev) => ({ ...prev, active: false }));
        simulateFishing();
      }, 500);
    }
  };

  const simulateFishing = async () => {
    setNotification(null);

    setTimeout(async () => {
      const catchChance = Math.random();
      if (catchChance > 0.5) {
        const fishTypes = ['Trout', 'Salmon', 'Bass', 'Catfish', 'Tuna'];
        const caughtFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        setNotification(`You caught a ${caughtFish}!`);

        const client = await getFishingGameChromiaClient();
        try {
          await fishingGameApi.pullFish(client, nft.token_id);
          console.log("Successfully pulled fish on the blockchain");
          await refreshNFTMetadata();
        } catch (error) {
          console.error("Error pulling fish:", error);
          setNotification(`Caught a ${caughtFish}, but failed to record it. Please try again.`);
        }
      } else {
        setNotification("No luck this time. Try again!");
      }
      setIsFishing(false);
    }, 2000);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  if (isLoading) {
    return <div className="text-center">Loading Fishing Rods...</div>;
  }

  if (fishingRods.length === 0) {
    return (
      <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
        <p className="text-lg font-semibold mb-2">You don&apos;t have any Fishing Rods!</p>
        <p className="mb-4">Visit the Inventory to bridge your Fishing Rods and start fishing.</p>
        <Link href="/inventory" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
          Go to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 order-1">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-auto border border-gray-600 rounded cursor-none"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
        />
        {selectedRod === null && (
          <div className="mt-4 p-4 bg-yellow-900 text-yellow-100 rounded-md">
            Please equip a fishing rod to start fishing.
          </div>
        )}
        {notification && (
          <div className="mt-4 p-4 bg-green-900 text-green-100 rounded-md flex justify-between items-center">
            <span>{notification}</span>
            <button
              onClick={dismissNotification}
              className="bg-green-700 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
      <div className="md:col-span-1 order-2 flex flex-col">
        <div className="mb-4">
          <NFTCard
            imageUrl={nft.metadata.image}
            tokenName={nft.metadata.name}
            tokenDescription={nft.metadata.description}
            metadata={nft.metadata}
            blockchain={nft.blockchain}
            isGamePage={true}
            actions={[]}
          />
        </div>
        <div className="flex-grow overflow-y-auto">
          <FishingRodList
            rods={fishingRods}
            selectedRod={selectedRod}
            onRodClick={handleRodClick}
          />
        </div>
      </div>
    </div>
  );
};

export default FishingGame;