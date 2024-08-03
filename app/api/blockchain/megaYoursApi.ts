import { NFT, NFTMetadata } from "@/app/types/nft";
import { Session, op } from "@chromia/ft4";

export const megaYoursApi = {
  getNFT: async (session: Session, project: string, collection: string, tokenId: number): Promise<NFT> => {
    const metadata = await session.query<NFTMetadata>("yours.metadata", { project, collection, token_id: tokenId });
    return {
      token_id: tokenId,
      metadata,
      blockchain: "Mega Chain",
      project: metadata.yours?.project || "MISSING",
      collection: metadata.yours?.collection || "MISSING",
    };
  },

  getNFTs: async (session: Session): Promise<NFT[]> => {
    return (await session.query<NFT[]>("importer.get_tokens")).map((nft) => ({
      ...nft,
      blockchain: "Mega Chain",
      project: nft.metadata.yours?.project || "MISSING",
      collection: nft.metadata.yours?.collection || "MISSING",
    }));
  },

  importNFT: async (session: Session, project: string, collection: string, tokenId: number, nft: NFTMetadata): Promise<void> => {
    await session.call(op("importer.import_token", 
    [
      nft.name,
      nft.attributes.map((a) => [a.trait_type, a.value]),
      [
        [],
        project,
        collection
      ],
      nft.description,
      nft.image,
      null
    ],
    tokenId));
  },
};