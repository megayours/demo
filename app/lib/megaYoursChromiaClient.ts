import { createClient, IClient } from "postchain-client";

// Configuration can be set via environment variables
const NODE_URL_POOL = process.env.NEXT_PUBLIC_MEGA_YOURS_NODE_URL_POOL || "http://localhost:7740";
const BLOCKCHAIN_IID = Number.parseInt(process.env.NEXT_PUBLIC_MEGA_YOURS_BLOCKCHAIN_IID || "1");

// Initialize the blockchain client
let megaYoursChromiaClient: IClient;

async function getMegaYoursChromiaClient() {
  if (megaYoursChromiaClient) return megaYoursChromiaClient;

  megaYoursChromiaClient = await createClient({
    directoryNodeUrlPool: NODE_URL_POOL,
    blockchainIid: BLOCKCHAIN_IID,
  });

  return megaYoursChromiaClient;
}

export default getMegaYoursChromiaClient;