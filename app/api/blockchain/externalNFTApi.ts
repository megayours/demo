import { NFT } from "@/app/types/nft";
import { ipfsApi } from "./ipfsApi";

const tokenIds = [8109, 8110, 8111, 8112, 8113, 8114];
const metadataPrefix = "ipfs://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna";

export const externalNFTApi = {
  getNFTs: async (): Promise<NFT[]> => {
    const tokens = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const metadata = await ipfsApi.fetchNFTMetadata(`${metadataPrefix}/${tokenId}`);
        return {
          token_id: tokenId,
          metadata: metadata,
          blockchain: "Ethereum"
        };
      })
    );
    return tokens;
  }
};