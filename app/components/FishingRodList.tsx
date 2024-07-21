import React from 'react';
import Image from 'next/image';
import { NFT } from '../types/nft';

interface FishingRodListProps {
  rods: NFT[];
  selectedRod: number | null;
  onRodClick: (rodId: number) => void;
}

const FishingRodList: React.FC<FishingRodListProps> = ({ rods, selectedRod, onRodClick }) => {
  return (
    <div className="bg-[var(--color-surface)] p-4 rounded-lg shadow-lg">
      <div className="space-y-2">
        {rods.map((rod) => {
          const durability = rod.metadata.attributes.find(attr => attr.trait_type === "Durability");
          const equippedBy = rod.metadata.attributes.find(attr => attr.trait_type === "Equipped By");

          return (
            <div
              key={rod.token_id}
              className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                selectedRod === rod.token_id ? 'bg-[var(--color-primary)] border-[var(--color-accent)]' : 'bg-[var(--color-card)] hover:bg-[var(--color-surface)]'
              }`}
              onClick={() => onRodClick(rod.token_id)}
            >
              <div className="w-10 h-10 relative mr-2 flex-shrink-0">
                <Image
                  src={rod.metadata.image}
                  alt={rod.metadata.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                />
              </div>
              <div className="flex-grow overflow-hidden">
                <h3 className="text-sm font-semibold text-white truncate">{rod.metadata.name}</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {durability && (
                    <span className="text-xs bg-[var(--color-surface)] text-white rounded-full px-2 py-0.5 truncate">
                      Durability: {durability.value}
                    </span>
                  )}
                  {equippedBy && (
                    <span className="text-xs bg-[var(--color-surface)] text-white rounded-full px-2 py-0.5 truncate">
                      Equipped By: {equippedBy.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FishingRodList;