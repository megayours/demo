import { NFT, serializeTokenMetadata, TokenMetadata } from "@/app/types/nft";
import { Session, op } from "@chromia/ft4";

const chainName = "Mega Chain";

export const megaYoursApi = {
  getNFT: async (session: Session, project: string, collection: string, tokenId: number): Promise<NFT> => {
    const metadata = await session.query<TokenMetadata>("yours.metadata", { project, collection, token_id: tokenId });
    return {
      token_id: tokenId,
      metadata: metadata,
      blockchain: chainName,
    };
  },

  getNFTs: async (session: Session): Promise<NFT[]> => {
    return (await session.query<NFT[]>("importer.get_tokens")).map((nft) => ({
      ...nft,
      blockchain: chainName
    }));
  },

  importNFT: async (session: Session, tokenId: number, metadata: TokenMetadata): Promise<void> => {
    await session.call(op("importer.import_token", serializeTokenMetadata(metadata), tokenId));
  },
};