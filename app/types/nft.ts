export type NFT = {
  token_id: number;
  metadata: NFTMetadata;
  blockchain: string;
}

export type NFTMetadata = {
  name: string;
  attributes: NFTAttribute[];
  description: string;
  image: string;
  animation_url?: string;
}

export type NFTAttribute = {
  trait_type: string;
  value: string;
}