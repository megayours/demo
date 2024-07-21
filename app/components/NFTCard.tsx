import Image from 'next/image';
import React from 'react';
import Spinner from './Spinner';
import { NFTMetadata, NFTAttribute } from '../types/nft';

interface NFTCardProps {
  imageUrl: string;
  tokenName: string;
  tokenDescription: string;
  metadata: NFTMetadata;
  blockchain: string;
  isGamePage?: boolean;
  actions?: { label: string; onClick: () => void; loading: boolean }[];
}

const NFTCard: React.FC<NFTCardProps> = ({ imageUrl, tokenName, tokenDescription, metadata, blockchain, isGamePage = false, actions = [] }) => {
  const renderAttribute = (attribute: NFTAttribute, index: number) => (
    <div key={`${attribute.trait_type}-${index}`} className="bg-gray-700 rounded-lg p-2 text-xs">
      <span className="font-semibold">{attribute.trait_type}:</span> {attribute.value}
    </div>
  );

  const filteredAttributes = isGamePage
    ? metadata.attributes.filter(attr => ['Fishes Caught', 'Fishing Rod'].includes(attr.trait_type))
    : metadata.attributes;

  return (
    <div className="bg-[var(--color-card)] rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 max-w-sm mx-auto">
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={tokenName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
          priority
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-2">{tokenName}</h2>
        <div className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2">
          {blockchain}
        </div>
        <p className="text-gray-300 text-sm line-clamp-3 mb-4">{tokenDescription}</p>
        
        {/* Attributes Section */}
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredAttributes.map((attribute, index) => renderAttribute(attribute, index))}
          </div>
        </div>

        {/* Actions Section */}
        {actions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="mega-button text-sm relative"
                disabled={action.loading}
              >
                {action.loading ? (
                  <>
                    <span className="opacity-0">{action.label}</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Spinner size="medium" />
                    </span>
                  </>
                ) : (
                  action.label
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;