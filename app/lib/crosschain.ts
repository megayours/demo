import { Session, applyTransfer, noopAuthenticator, createAmountFromBalance, createKeyStoreInteractor, createSingleSigAuthDescriptorRegistration, createWeb3ProviderEvmKeyStore, hours, initTransfer, op, registerAccount, registrationStrategy, ttlLoginRule, findPathToChainForAsset, BufferId } from "@chromia/ft4";
import { createClient } from "postchain-client";
import { serializeTokenMetadata, TokenMetadata } from "../types/nft";

const DAPP_NODE_URL_POOL = process.env.NEXT_PUBLIC_D1_NODE_URL_POOL || "http://localhost:7740";

// Store multiple sessions
const sessions: { [blockchainRid: string]: Session } = {};

export async function createSessionForChain(blockchainRid: string): Promise<Session> {
  if (sessions[blockchainRid]) {
    return sessions[blockchainRid];
  }

  const dappClient = await createClient({
    directoryNodeUrlPool: [DAPP_NODE_URL_POOL],
    blockchainRid
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

  sessions[blockchainRid] = newSession;
  return newSession;
}

export async function bridgeNFT(session: Session | undefined, project: string, collection: string, tokenId: number, targetBlockchainRid: string) {
  if (!session) return;

  const targetSession = await createSessionForChain(targetBlockchainRid);

  const metadata = await session.query<TokenMetadata>("yours.metadata", { project, collection, token_id: tokenId });
  console.log(`Metadata: ${JSON.stringify(metadata)}`);
  await session.transactionBuilder()
    .add(op(
      "yours.init_transfer",
      session.account.id,
      project,
      collection,
      tokenId,
      1,
      serializeTokenMetadata(metadata)
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

export async function bridgeNFTBack(megaChainSession: Session | undefined, project: string, collection: string, tokenId: number, sourceBlockchainRid: string) {
  if (!megaChainSession) return;

  const sourceSession = await createSessionForChain(sourceBlockchainRid);

  const metadata = await sourceSession.query<TokenMetadata>("yours.metadata", { project, collection, token_id: tokenId });

  await sourceSession.transactionBuilder()
    .add(op(
      "yours.init_transfer",
      sourceSession.account.id,
      project,
      collection,
      tokenId,
      1,
      serializeTokenMetadata(metadata)
    ), {
      onAnchoredHandler: async (data) => {
        if (!data) throw new Error("No data provided");
        const iccfProofOperation = await data.createProof(megaChainSession.blockchainRid);
        await megaChainSession.transactionBuilder()
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