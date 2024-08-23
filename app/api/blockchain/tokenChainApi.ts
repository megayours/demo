import { BLOCKCHAINS } from "@/app/lib/constants";
import { NFT, serializeTokenMetadata, TokenMetadata } from "@/app/types/nft";
import { Session, op } from "@chromia/ft4";

export const tokenChainApi = {
  getImportedTokens: async (session: Session): Promise<NFT[]> => {
    return (await session.query<NFT[]>("importer.get_imported_tokens")).map((nft) => ({
      ...nft
    }));
  },

  getNFT: async (session: Session, project: string, collection: string, tokenId: number): Promise<NFT | undefined> => {
    const metadata = await session.query<TokenMetadata>("yours.metadata", { project, collection, token_id: tokenId });
    if (metadata == null) return undefined;

    return {
      token_id: tokenId,
      metadata: metadata,
      blockchain: BLOCKCHAINS.TOKEN_CHAIN,
    };
  },

  getNFTs: async (session: Session): Promise<NFT[]> => {
    return (await session.query<NFT[]>("importer.get_tokens", { account_id: session.account.id })).map((nft) => ({
      ...nft,
      blockchain: BLOCKCHAINS.TOKEN_CHAIN
    }));
  },

  getProjects: async (session: Session): Promise<string[]> => {
    return (await session.query<string[]>("yours.projects", { owner_id: session.account.id }));
  },

  getCollections: async (session: Session, project: string): Promise<string[]> => {
    return (await session.query<string[]>("yours.collections", { project: project }));
  },

  importNFT: async (session: Session, tokenId: number, metadata: TokenMetadata): Promise<void> => {
    if (metadata.yours.collection === "Pudgy Rods") {
      await session.call(op("importer.import_nft", serializeTokenMetadata(metadata), BLOCKCHAINS.ETHEREUM, "0xROD", tokenId));
    } else {
      await session.call(op("importer.import_nft", serializeTokenMetadata(metadata), BLOCKCHAINS.ETHEREUM, "0xPUDGY", tokenId));
    }
  },

  createNFT: async (session: Session, metadata: TokenMetadata): Promise<void> => {
    await session.call(op("importer.create_nft", serializeTokenMetadata(metadata)));
  },
};