import Image from 'next/image';
import React, { useState } from 'react';

interface Action {
  label: string;
  onClick: () => Promise<void>;
}

interface NFTCardProps {
  imageUrl: string;
  tokenName: string;
  tokenDescription: string;
  actions?: Action[];
  blockchain: string;
}

const NFTCard: React.FC<NFTCardProps> = ({ imageUrl, tokenName, tokenDescription, actions, blockchain }) => {
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});

  const handleActionClick = async (action: Action) => {
    setLoadingActions(prev => ({ ...prev, [action.label]: true }));
    try {
      await action.onClick();
    } finally {
      setLoadingActions(prev => ({ ...prev, [action.label]: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 max-w-sm mx-auto">
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
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{tokenName}</h2>
        <div className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2">
          {blockchain}
        </div>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{tokenDescription}</p>
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                disabled={loadingActions[action.label]}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {loadingActions[action.label] ? (
                  <>
                    <span className="opacity-0">{action.label}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    </div>
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