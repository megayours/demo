import { RawGtv } from "postchain-client";
import { ADMIN_ID } from "../lib/constants";

export type YoursMetadata = {
  modules: string[];
  project: Project;
  collection: string;
};

export type Project = {
  name: string;
  owner_id: Buffer;
}

export type Property = {
  name?: string;
  value: RawGtv;
  display_value?: string;
  class?: string;
  css?: {
    [key: string]: RawGtv;
  };
};

export type TokenMetadata = {
  name: string;
  properties: {
    [key: string]: string | number | boolean | Property;
  };
  yours: YoursMetadata;
  description?: string;
  image?: string;
  animation_url?: string;
};

export type NFT = {
  token_id: number;
  metadata: TokenMetadata;
  blockchain: string;
}

export type ERC721Metadata = {
  name: string;
  attributes: ERC721Attribute[];
  description: string;
  image: string;
  animation_url?: string;
  yours?: YoursMetadata;
}

export type ERC721Attribute = {
  trait_type: string;
  value: string;
}

export function serializeTokenMetadata(metadata: TokenMetadata): any[] {
  console.log(`Serializing metadata: ${JSON.stringify(metadata)}`);
  const yours: any[] = [
    metadata.yours.modules,
    [metadata.yours.project.name, metadata.yours.project.owner_id],
    metadata.yours.collection,
  ];

  const result: any[] = [
    metadata.name,
    JSON.stringify(metadata.properties),
    yours,
    metadata.description ?? null,
    metadata.image ?? null,
    metadata.animation_url ?? null,
  ];

  return result;
}

export function convertERC721Metadata(metadata: ERC721Metadata, project: string, collection: string): TokenMetadata {
  return {
    name: metadata.name,
    properties: Object.fromEntries(metadata.attributes.map(attr => [attr.trait_type, attr.value])),
    yours: {
      modules: [],
      project: {
        name: project,
        owner_id: Buffer.from(ADMIN_ID, 'hex'),
      },
      collection: collection,
    },
    description: metadata.description,
    image: metadata.image,
    animation_url: metadata.animation_url,
  };
}