import { createClient, IClient } from "postchain-client";

// Configuration can be set via environment variables
const NODE_URL_POOL = process.env.NEXT_PUBLIC_MEGA_YOURS_NODE_URL_POOL || "http://localhost:7740";
const BLOCKCHAIN_IID = Number.parseInt(process.env.NEXT_PUBLIC_FISHING_GAME_BLOCKCHAIN_IID || "2");

// Initialize the blockchain client
let fishingGameChromiaClient: IClient;

async function getFishingGameChromiaClient() {
  if (fishingGameChromiaClient) return fishingGameChromiaClient;

  fishingGameChromiaClient = await createClient({
    directoryNodeUrlPool: NODE_URL_POOL,
    blockchainIid: BLOCKCHAIN_IID,
  });

  return fishingGameChromiaClient;
}

export default getFishingGameChromiaClient;