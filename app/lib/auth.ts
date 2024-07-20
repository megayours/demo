import { createKeyStoreInteractor, createLocalStorageLoginKeyStore, createSingleSigAuthDescriptorRegistration, createWeb3ProviderEvmKeyStore, hours, registerAccount, registrationStrategy, ttlLoginRule, Session } from "@chromia/ft4";
import getMegaYoursChromiaClient from "./megaYoursChromiaClient";

declare global {
  interface Window {
    ethereum: any;
  }
}

export async function createSession(autoLogin: boolean = false): Promise<{ session: Session | undefined, logout: () => void }> {
  if (!window.ethereum) {
    console.error(`Ethereum not found on window`);
    return { session: undefined, logout: () => {} };
  }

  const client = await getMegaYoursChromiaClient();
  const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
  const evmKeyStoreInteractor = createKeyStoreInteractor(
    client,
    evmKeyStore
  );

  const accounts = await evmKeyStoreInteractor.getAccounts();
  const loginKeyStore = createLocalStorageLoginKeyStore();

  if (accounts.length > 0) {
    const accountId = accounts[0].id;
    if (autoLogin) {
      const keyStore = await loginKeyStore.getKeyStore(accountId);
      const pubKey = keyStore?.pubKey;
      if (!pubKey) return { session: undefined, logout: () => {} };

      // const adID = await client.query("ft4.get_first_allowed_auth_descriptor_by_signers", {
      //   op_name: "importer.import_nft",
      //   args: [],
      //   account_id: accountId,
      //   signers: [pubKey]
      // });
      // const isValidAD = await client.query("ft4.is_auth_descriptor_valid", {
      //   account_id: accountId,
      //   auth_descriptor_id: adID
      // });
      const isValidAD = true; // Placeholder for actual validation
      if (isValidAD) {
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
      } else {
        return { session: undefined, logout: () => {} };
      }
    }
    
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
  } else if (!autoLogin) {
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

  return { session: undefined, logout: () => {} };
}