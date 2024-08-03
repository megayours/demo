import { Session, createKeyStoreInteractor, createSingleSigAuthDescriptorRegistration, createWeb3ProviderEvmKeyStore, hours, registerAccount, registrationStrategy, ttlLoginRule } from "@chromia/ft4";
import { createClient } from "postchain-client";
import { useEffect, useState } from "react";

const NODE_URL_POOL = process.env.NEXT_PUBLIC_D1_NODE_URL_POOL || "http://localhost:7740";
const BLOCKCHAIN_RID = process.env.NEXT_PUBLIC_MEGA_CHAIN_BLOCKCHAIN_RID;

export function useChromiaAuth() {
  console.log("Initializing Session");
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const initSession = async () => {
      console.log("Initializing Session");

      let config: any = {
        directoryNodeUrlPool: NODE_URL_POOL,
      };

      if (BLOCKCHAIN_RID) {
        config.blockchainRid = BLOCKCHAIN_RID;
      } else {
        config.blockchainIid = 1;
      }

      // 1. Initialize Client
      const client = await createClient(config);

      // 2. Connect with MetaMask
      const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);

      // 3. Get all accounts associated with evm address
      const evmKeyStoreInteractor = createKeyStoreInteractor(
        client,
        evmKeyStore
      );
      const accounts = await evmKeyStoreInteractor.getAccounts();

      if (accounts.length > 0) {
        // 4. Start a new session
        const { session } = await evmKeyStoreInteractor.login({
          accountId: accounts[0].id,
          config: {
            rules: ttlLoginRule(hours(2)),
            flags: ["MySession"]
          }
        })
        setSession(session);
      } else {
        // 5. Create a new account by signing a message using metamask
        const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);
        const { session } = await registerAccount(client, evmKeyStore, registrationStrategy.open(authDescriptor, {
          config: {
            rules: ttlLoginRule(hours(2)),
            flags: ["MySession"]
          }
        }));
        return session;
      }
    };

    initSession();
  }, []);

  return session;
}