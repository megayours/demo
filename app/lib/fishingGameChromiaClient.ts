import { createClient, IClient } from "postchain-client";

// Configuration can be set via environment variables
const NODE_URL_POOL = process.env.NEXT_PUBLIC_D1_NODE_URL_POOL || "http://localhost:7740";
const BLOCKCHAIN_RID = process.env.NEXT_PUBLIC_GAME_CHAIN_BLOCKCHAIN_RID;

// Initialize the blockchain client
let fishingGameChromiaClient: IClient;

async function getFishingGameChromiaClient() {
  if (fishingGameChromiaClient) return fishingGameChromiaClient;

  let config: any = {
    directoryNodeUrlPool: NODE_URL_POOL,
  };

  if (BLOCKCHAIN_RID) {
    config.blockchainRid = BLOCKCHAIN_RID;
  } else {
    config.blockchainIid = 2;
  }

  fishingGameChromiaClient = await createClient(config);

  return fishingGameChromiaClient;
}

export default getFishingGameChromiaClient;