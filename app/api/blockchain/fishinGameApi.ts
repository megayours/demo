import { NFT } from "@/app/types/nft";
import { nop, op, Session } from "@chromia/ft4";
import { IClient } from "postchain-client";

type PudgyRod = {
  id: number;
}

export const fishingGameApi = {
  getNFTs: async (client: IClient, accountId: Buffer): Promise<NFT[]> => {
    return (await client.query<NFT[]>("pudgy.get_tokens", { account_id: accountId })).map((nft) => ({
      ...nft,
      blockchain: "Fishing Game"
    }));
  },

  getNFT: async (session: Session, project: string, collection: string, tokenId: number): Promise<NFT | undefined> => {
    const metadata = await session.query<any>("yours.metadata", { project, collection, token_id: tokenId });
    if (metadata == null) return undefined;
    return {
      token_id: tokenId,
      metadata,
      blockchain: "Fishing Game",
    };
  },

  getPudgyRods: async (session: Session): Promise<PudgyRod[]> => {
    return session.query<PudgyRod[]>("pudgy.get_rods", { account_id: session.account.id });
  },

  equipRod: async (client: IClient, pudgyPenguinId: number, pudgyRodId: number): Promise<void> => {
    
    const tx = {
      operations: [
        op("pudgy.equip_fishing_rod", pudgyPenguinId, pudgyRodId),
        nop()
      ],
      signers: []
    };

    await client.sendTransaction(tx);
  },

  unequipRod: async (client: IClient, pudgyPenguinId: number): Promise<void> => {
    const tx = {
      operations: [
        op("pudgy.unequip_fishing_rod", pudgyPenguinId),
        nop()
      ],
      signers: []
    };

    await client.sendTransaction(tx);
  },

  pullFish: async (client: IClient, pudgyPenguinId: number): Promise<void> => {
    const tx = {
      operations: [
        op("pudgy.pull_fish", pudgyPenguinId),
        nop()
      ],
      signers: []
    };

    await client.sendTransaction(tx);
  }
};