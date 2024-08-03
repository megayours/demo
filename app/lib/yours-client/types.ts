import { RawGtv } from "postchain-client";

export type Token = {
  collection: string;
  tokenId: string;
}

export type NFT = {
  token_id: number;
  metadata: TokenMetadata;
  blockchain: string;
  project: string;
  collection: string;
}

export type TTokenMetadata = {
  name: string;
  attributes: NFTAttribute[];
  description: string;
  image: string;
  animation_url?: string;
  yours?: YoursMetadata;
}

export interface TokenMetadata extends TTokenMetadata {
  toRawGtv(): RawGtv;
}

type TYoursMetadata = {
  project: string;
  collection: string;
}

export interface YoursMetadata extends TYoursMetadata {
  toRawGtv(): RawGtv;
}

export type TNFTAttribute = {
  trait_type: string;
  value: string;
}

export interface NFTAttribute extends TNFTAttribute {
  toRawGtv(): RawGtv;
}

export const createSerializableTokenMetadata = (data: TTokenMetadata): TokenMetadata => ({
  ...data,
  toRawGtv() {
    return [
      this.name,
      this.attributes.map(attr => createSerializableNFTAttribute(attr).toRawGtv()),
      this.description,
      this.image,
      this.animation_url ?? null,
      this.yours ? createSerializableYoursMetadata(this.yours).toRawGtv() : null
    ]
  }
});

export const createSerializableYoursMetadata = (data: TYoursMetadata): YoursMetadata => ({
  ...data,
  toRawGtv() {
    return [
      this.project,
      this.collection
    ]
  }
});

export const createSerializableNFTAttribute = (data: TNFTAttribute): NFTAttribute => ({
  ...data,
  toRawGtv() {
    return [
      this.trait_type,
      this.value
    ]
  }
});