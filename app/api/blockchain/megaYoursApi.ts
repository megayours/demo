import { NFT, NFTMetadata } from "@/app/types/nft";
import { Session, op } from "@chromia/ft4";

export const megaYoursApi = {
  getNFTs: async (session: Session): Promise<NFT[]> => {
    return (await session.query<NFT[]>("importer.get_tokens")).map((nft) => ({
      ...nft,
      blockchain: "Mega Chain"
    }));
  },

  importNFT: async (session: Session, tokenId: number, nft: NFTMetadata): Promise<void> => {
    await session.call(op("importer.import_token", 
    [
      nft.name,
      nft.attributes.map((a) => [a.trait_type, a.value]),
      [
        [],
        "Mega Chain Project",
        "Yours Collection"
      ],
      nft.description,
      nft.image,
      null
    ],
    tokenId));
  },
};