import { NFTMetadata } from "@/app/types/nft";

export const ipfsApi = {
  getGatewayUrl: (ipfsUrl: string): string => {
    const ipfsPrefix = "ipfs://";
    if (ipfsUrl.startsWith(ipfsPrefix)) {
      const path = ipfsUrl.slice(ipfsPrefix.length);
      return `https://ipfs.io/ipfs/${path}`;
    }
    return ipfsUrl; // Return the original URL if it's not an IPFS URL
  },

  fetchNFTMetadata: async (url: string): Promise<NFTMetadata> => {
    const response = await fetch(ipfsApi.getGatewayUrl(url));
    const data = await response.json();
    return {
      image: ipfsApi.getGatewayUrl(data.image),
      name: data.name,
      description: data.description,
      attributes: data.attributes
    };
  }
};