import { NFT } from "@/app/types/nft";
import { ipfsApi } from "./ipfsApi";

const project = "TheIglooCompany";

const penguinCollection = "Pudgy Penguins";
const penguinTokenIds = [8109, 8110, 8111, 8112, 8113, 8114];
const penguinMetadataPrefix = "ipfs://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna";

const rodCollection = "Pudgy Rods";
const rodTokenIds = [1447, 8400, 706, 8225, 3525, 6610];
const rodMetadataPrefix = "https://api.pudgypenguins.io/present";

export const externalNFTApi = {
  getNFTs: async (): Promise<NFT[]> => {
    const pudgyTokens = await Promise.all(
      penguinTokenIds.map(async (tokenId) => {
        const metadata = await ipfsApi.fetchNFTMetadata(`${penguinMetadataPrefix}/${tokenId}`);
        return {
          token_id: tokenId,
          metadata: metadata,
          blockchain: "Ethereum",
          project: project,
          collection: penguinCollection,
        };
      })
    );

    const fishingRodTokens = await Promise.all(
      rodTokenIds.map(async (tokenId) => {
        const metadata = await ipfsApi.fetchNFTMetadata(`${rodMetadataPrefix}/${tokenId}`);
        const fixedMetadata = {
          ...metadata,
          attributes: [
            metadata.attributes as any
          ]
        };

        console.log("fixedMetadata", fixedMetadata);

        return {
          token_id: tokenId,
          metadata: fixedMetadata,
          blockchain: "Ethereum",
          project: project,
          collection: rodCollection,
        };
      })
    );
    return [...pudgyTokens, ...fishingRodTokens];
  }
};