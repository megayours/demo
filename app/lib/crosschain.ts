import { Session, applyTransfer, noopAuthenticator, createAmountFromBalance, createKeyStoreInteractor, createSingleSigAuthDescriptorRegistration, createWeb3ProviderEvmKeyStore, hours, initTransfer, op, registerAccount, registrationStrategy, ttlLoginRule, findPathToChainForAsset, BufferId } from "@chromia/ft4";
import { createClient } from "postchain-client";

const DAPP_NODE_URL_POOL = process.env.NEXT_PUBLIC_DAPP_NODE_URL_POOL || "http://localhost:7740";

// Store multiple sessions
const sessions: { [blockchainIid: number]: Session } = {};

export async function createSessionForChain(blockchainIid: number): Promise<Session> {
  if (sessions[blockchainIid]) {
    return sessions[blockchainIid];
  }

  const dappClient = await createClient({
    nodeUrlPool: [DAPP_NODE_URL_POOL],
    blockchainIid,
  });

  const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
  const evmKeyStoreInteractor = createKeyStoreInteractor(
    dappClient,
    evmKeyStore
  );

  const accounts = await evmKeyStoreInteractor.getAccounts();
  const account = accounts[0];

  let newSession: Session;

  if (accounts.length > 0) {
    const { session } = await evmKeyStoreInteractor.login({
      accountId: account.id,
      config: {
        rules: ttlLoginRule(hours(1)),
        flags: ["MySession"]
      }
    });
    newSession = session;
  } else {
    const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);
    const { session } = await registerAccount(dappClient, evmKeyStore, registrationStrategy.open(authDescriptor, {
      config: {
        rules: ttlLoginRule(hours(1)),
        flags: ["MySession"]
      }
    }));
    newSession = session;
  }

  sessions[blockchainIid] = newSession;
  return newSession;
}

export async function bridgeNFT(session: Session | undefined, collection: string, tokenId: number, targetBlockchainIid: number) {
  if (!session) return;

  const targetSession = await createSessionForChain(targetBlockchainIid);

  const metadata = await session.query("yours.metadata", { collection, token_id: tokenId });

  await session.transactionBuilder()
    .add(op(
      "yours.init_transfer",
      session.account.id,
      collection,
      tokenId,
      1,
      metadata
    ), {
      onAnchoredHandler: async (data) => {
        if (!data) throw new Error("No data provided");
        const iccfProofOperation = await data.createProof(targetSession.blockchainRid);
        await targetSession.transactionBuilder()
          .add(iccfProofOperation, {
            authenticator: noopAuthenticator,
          })
          .add(op(
            "yours.apply_transfer",
            data.tx,
            data.opIndex
          ), {
            authenticator: noopAuthenticator,
          })
          .buildAndSend();
      }
    })
    .buildAndSendWithAnchoring();
}

export async function bridgeNFTBack(session: Session | undefined, collection: string, tokenId: number, sourceBlockchainIid: number) {
  if (!session) return;

  const sourceSession = await createSessionForChain(sourceBlockchainIid);

  const metadata = await sourceSession.query("yours.metadata", { collection, token_id: tokenId });

  await sourceSession.transactionBuilder()
    .add(op(
      "yours.init_transfer",
      sourceSession.account.id,
      collection,
      tokenId,
      1,
      metadata
    ), {
      onAnchoredHandler: async (data) => {
        if (!data) throw new Error("No data provided");
        const iccfProofOperation = await data.createProof(session.blockchainRid);
        await session.transactionBuilder()
          .add(iccfProofOperation, {
            authenticator: noopAuthenticator,
          })
          .add(op(
            "yours.apply_transfer",
            data.tx,
            data.opIndex
          ), {
            authenticator: noopAuthenticator,
          })
          .buildAndSend();
      }
    })
    .buildAndSendWithAnchoring();
}