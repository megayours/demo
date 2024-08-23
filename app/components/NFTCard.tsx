import Image from 'next/image';
import React from 'react';
import Spinner from './Spinner';
import { Property, TokenMetadata } from '../types/nft';
import { BLOCKCHAINS } from '../lib/constants';

const getBlockchainGradient = (blockchain: string): string => {
  switch (blockchain) {
    case BLOCKCHAINS.ETHEREUM:
      return 'from-blue-500 via-blue-400 to-blue-300';
    case BLOCKCHAINS.TOKEN_CHAIN:
      return 'from-purple-600 via-purple-500 to-purple-400';
    case BLOCKCHAINS.FISHING_GAME:
      return 'from-green-500 via-green-400 to-green-300';
    default:
      return 'from-gray-500 via-gray-400 to-gray-300';
  }
};

const getAttributeColor = (attributeName: string): string => {
  switch (attributeName.toLowerCase()) {
    case 'fishes caught':
    case 'fishing rod':
    case 'equipped by':
    case 'durability':
      return 'bg-green-500';
    case `recent ${BLOCKCHAINS.TOKEN_CHAIN} visit`:
      return 'bg-purple-600';
    default:
      return 'bg-gray-700';
  }
};

interface NFTCardProps {
  imageUrl: string;
  tokenName: string;
  tokenDescription: string;
  metadata: TokenMetadata;
  blockchain: string;
  isGamePage?: boolean;
  actions?: { label: string; onClick: () => void; loading: boolean }[];
}

const NFTCard: React.FC<NFTCardProps> = ({ imageUrl, tokenName, tokenDescription, metadata, blockchain, isGamePage = false, actions = [] }) => {
  const filteredProperties: [string, string | number | boolean | Property][] = isGamePage
    ? Object.entries(metadata.properties).filter(([key]) => 
        ['Fishes Caught', 'Fishing Rod'].includes(key)
      )
    : Object.entries(metadata.properties);

  const renderAttribute = (attribute: [string, string | number | boolean | Property], index: number) => (
    <div
      key={`${attribute[0]}-${index}`}
      className={`${getAttributeColor(attribute[0])} rounded-lg p-2 text-xs`}
    >
      <span className="font-semibold">{attribute[0]}:</span>{' '}
      {typeof attribute[1] === 'object' && 'value' in attribute[1]
        ? String(attribute[1].value)
        : String(attribute[1])}
    </div>
  );

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
        <div className="items-center gap-2 mb-3">
          <p className="text-sm font-semibold text-gray-200 whitespace-nowrap">Token & Metadata Source</p>
          <div className={`inline-flex bg-gradient-to-r ${getBlockchainGradient(blockchain)} text-white text-sm font-medium px-3 py-1 rounded-full mt-2`}>
            {blockchain}
          </div>
        </div>
        <p className="text-gray-300 text-sm line-clamp-3 mb-4">{tokenDescription}</p>

        {/* Attributes Section */}
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredProperties.map((attribute, index) => renderAttribute(attribute, index))}
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