import { BLOCKCHAINS } from "@/app/lib/constants";
import { NFT, TokenMetadata } from "@/app/types/nft";
import { op, Session } from "@chromia/ft4";

type PudgyRod = {
  id: number;
}

export const fishingGameApi = {
  getNFTs: async (session: Session): Promise<NFT[]> => {
    return (await session.query<NFT[]>("pudgy.get_tokens", { account_id: session.account.id })).map((nft) => ({
      ...nft,
      blockchain: BLOCKCHAINS.FISHING_GAME
    }));
  },

  getNFT: async (session: Session, project: string, collection: string, tokenId: number): Promise<NFT | undefined> => {
    const metadata = await session.query<TokenMetadata>("yours.metadata", { project, collection, token_id: tokenId });
    if (metadata == null) return undefined;

    return {
      token_id: tokenId,
      metadata,
      blockchain: BLOCKCHAINS.FISHING_GAME,
    };
  },

  getPudgyRods: async (session: Session): Promise<PudgyRod[]> => {
    return session.query<PudgyRod[]>("pudgy.get_rods", { account_id: session.account.id });
  },

  equipRod: async (session: Session, pudgyPenguinId: number, pudgyRodId: number): Promise<void> => {
    await session.call(op("pudgy.equip_fishing_rod", pudgyPenguinId, pudgyRodId));
  },

  unequipRod: async (session: Session, pudgyPenguinId: number): Promise<void> => {
    await session.call(op("pudgy.unequip_fishing_rod", pudgyPenguinId));
  },

  pullFish: async (session: Session, pudgyPenguinId: number): Promise<void> => {
    await session.call(op("pudgy.pull_fish", pudgyPenguinId));
  }
};
