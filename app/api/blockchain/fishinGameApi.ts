import { NFT } from "@/app/types/nft";
import { nop, op } from "@chromia/ft4";
import { IClient } from "postchain-client";

type PudgyRod = {
  id: number;
}

export const fishingGameApi = {
  getNFT: async (client: IClient, project: string, collection: string, tokenId: number): Promise<NFT | undefined> => {
    const metadata = await client.query<any>("yours.metadata", { project, collection, token_id: tokenId });
    if (metadata == null) return undefined;
    return {
      token_id: tokenId,
      metadata,
      blockchain: "Fishing Game",
      project: metadata.yours.project,
      collection: metadata.yours.collection,
    };
  },

  getPudgyRods: async (client: IClient): Promise<PudgyRod[]> => {
    return client.query<PudgyRod[]>("pudgy.get_rods", {});
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