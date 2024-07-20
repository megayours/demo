import { NFT, NFTMetadata } from "@/app/types/nft";
import { IClient } from "postchain-client";

export const fishingGameApi = {
  getNFT: async (client: IClient, tokenId: number): Promise<NFT | undefined> => {
    const metadata = await client.query<any>("yours.metadata", { collection: "Yours Collection", token_id: tokenId });
    if (metadata == null) return undefined;
    return {
      token_id: tokenId,
      metadata,
      blockchain: "Fishing Game",
    };
  },
};