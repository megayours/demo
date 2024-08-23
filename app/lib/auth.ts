import { createKeyStoreInteractor, createLocalStorageLoginKeyStore, createSingleSigAuthDescriptorRegistration, createWeb3ProviderEvmKeyStore, hours, registerAccount, registrationStrategy, ttlLoginRule, Session } from "@chromia/ft4";
import { IClient } from "postchain-client";
import getMegaYoursChromiaClient from "./tokenChainChromiaClient";

declare global {
  interface Window {
    ethereum: any;
  }
}

export async function createSession(client: IClient): Promise<{ session: Session | undefined, logout: () => void }> {
  if (!window.ethereum) {
    console.error(`Ethereum not found on window`);
    return { session: undefined, logout: () => { } };
  }

  const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
  const evmKeyStoreInteractor = createKeyStoreInteractor(
    client,
    evmKeyStore
  );

  const accounts = await evmKeyStoreInteractor.getAccounts();
  const loginKeyStore = createLocalStorageLoginKeyStore();

  if (accounts.length > 0) {
    const accountId = accounts[0].id;
    const { session, logout } = await evmKeyStoreInteractor.login({
      accountId: accountId,
      loginKeyStore,
      config: {
        rules: ttlLoginRule(hours(2)),
        flags: ["MySession"]
      }
    });
    return {
      session,
      logout: () => {
        logout();
        console.log('Logging out...');
      }
    };
  }

  const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);
  const { session, logout } = await registerAccount(client, evmKeyStore, registrationStrategy.open(authDescriptor, {
    config: {
      rules: ttlLoginRule(hours(2)),
      flags: ["MySession"]
    }
  }));

  return {
    session,
    logout: () => {
      logout();
      console.log('Logging out...');
    }
  };
}