export type NFT = {
  token_id: number;
  metadata: NFTMetadata;
  blockchain: string;
  project: string;
  collection: string;
}

export type NFTMetadata = {
  name: string;
  attributes: NFTAttribute[];
  description: string;
  image: string;
  animation_url?: string;
  yours?: YoursMetadata;
}

export type YoursMetadata = {
  project: string;
  collection: string;
}

export type NFTAttribute = {
  trait_type: string;
  value: string;
}