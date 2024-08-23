import { createClient, IClient } from "postchain-client";

// Configuration can be set via environment variables
const NODE_URL_POOL = process.env.NEXT_PUBLIC_D1_NODE_URL_POOL || "http://localhost:7740";
const BLOCKCHAIN_RID = process.env.NEXT_PUBLIC_MEGA_CHAIN_BLOCKCHAIN_RID;

// Initialize the blockchain client
let megaYoursChromiaClient: IClient;

async function getTokenChainChromiaClient() {
  console.log("Getting Mega Yours Chromia Client");
  console.log("NODE_URL_POOL", NODE_URL_POOL);
  console.log("BLOCKCHAIN_RID", BLOCKCHAIN_RID);
  if (megaYoursChromiaClient) return megaYoursChromiaClient;

  let config: any = {
    directoryNodeUrlPool: NODE_URL_POOL,
  };

  if (BLOCKCHAIN_RID) {
    config.blockchainRid = BLOCKCHAIN_RID;
  } else {
    config.blockchainIid = 1;
  }

  megaYoursChromiaClient = await createClient(config);

  return megaYoursChromiaClient;
}

export default getTokenChainChromiaClient;