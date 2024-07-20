import { Session, applyTransfer, noopAuthenticator, createAmountFromBalance, createKeyStoreInteractor, createSingleSigAuthDescriptorRegistration, createWeb3ProviderEvmKeyStore, hours, initTransfer, op, registerAccount, registrationStrategy, ttlLoginRule, findPathToChainForAsset, BufferId } from "@chromia/ft4";
import { createClient } from "postchain-client";

const DAPP_NODE_URL_POOL = process.env.NEXT_PUBLIC_DAPP_NODE_URL_POOL || "http://localhost:7740";

export async function bridgeNFT(session: Session | undefined, tokenId: number) {
  if (!session) return;

  const dappClient = await createClient({
    nodeUrlPool: [DAPP_NODE_URL_POOL],
    blockchainIid: 2,
  });

  const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
  const evmKeyStoreInteractor = createKeyStoreInteractor(
    dappClient,
    evmKeyStore
  );

  const accounts = await evmKeyStoreInteractor.getAccounts();
  const account = accounts[0];

  let dappSession: Session;
  let dappLogout = () => { };
  if (accounts.length > 0) {
    const { session, logout } = await evmKeyStoreInteractor.login({
      accountId: account.id,
      config: {
        rules: ttlLoginRule(hours(1)),
        flags: ["MySession"]
      }
    });

    dappSession = session;
    dappLogout = logout;
  } else {
    const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);
    const { session, logout } = await registerAccount(dappClient, evmKeyStore, registrationStrategy.open(authDescriptor, {
      config: {
        rules: ttlLoginRule(hours(1)),
        flags: ["MySession"]
      }
    }));

    dappSession = session;
    dappLogout = logout;
  }

  // const path = await findPathToChainForAsset(session, asset, targetChainRid);
  const path = [dappClient.config.blockchainRid];
  console.log(`Path: ${JSON.stringify(path)}`);

  const metadata = await session.query("yours.metadata", { collection: "Yours Collection", token_id: tokenId });

  await session.transactionBuilder()
    .add(op(
      "yours.init_transfer",
      session.account.id,
      "Yours Collection",
      tokenId,
      1,
      metadata
    ), {
      onAnchoredHandler: async (data) => {
        if (!data) throw new Error("No data provided");
        const iccfProofOperation = await data.createProof(dappClient.config.blockchainRid);
        await dappSession.transactionBuilder()
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

    // .add(initTransfer(
    //   session.account.id,
    //   tokenId,
    //   createAmountFromBalance(BigInt(1), 0),
    //   path,
    //   Date.now() + 60 * 60 * 24 * 1000
    // ), {
    //   onAnchoredHandler: async (data) => {
    //     if (!data) throw new Error("No data provided");
    //     const iccfProofOperation = await data.createProof(targetChainRid);
    //     await dappSession.transactionBuilder()
    //       .add(
    //         op(
    //           "originals.register_crosschain_asset",
    //           asset.name,
    //           asset.symbol,
    //           asset.decimals,
    //           asset.blockchainRid,
    //           asset.iconUrl,
    //           asset.type,
    //           session.blockchainRid,
    //         ),
    //         {
    //           authenticator: noopAuthenticator,
    //         }
    //       )
    //       .add(iccfProofOperation, {
    //         authenticator: noopAuthenticator,
    //       })
    //       .add(
    //         applyTransfer(data.tx, data.opIndex, data.tx, data.opIndex, 0),
    //         { authenticator: noopAuthenticator },
    //       )
    //       .add(op("originals.apply_transfer_metadata"), {
    //         authenticator: noopAuthenticator
    //       })
    //       .buildAndSend();
    //   }
    // })
    // .add(op("originals.init_transfer_metadata", metadata), {
    //   authenticator: noopAuthenticator
    // })
    // .buildAndSendWithAnchoring();

  // let transferTransactionRid: Buffer | undefined = undefined;
  // await new Promise<void>((resolve, reject) => {
  //   const onAnchoredHandler = async (
  //     data: {
  //       operation: Operation;
  //       opIndex: number;
  //       tx: RawGtx;
  //       createProof: (blockchainRid: BufferId) => Promise<Operation>;
  //     } | null,
  //     error: Error | null,
  //   ) => {
  //     if (error) {
  //       reject(error);
  //       return;
  //     }
  //     if (!data) {
  //       reject(new Error("No data provided"));
  //       return;
  //     }
  //     const iccfProofOperation = await data.createProof(targetChainRid);
  //     try {
  //       await session.transactionBuilder()
  //         .add(iccfProofOperation, {
  //           authenticator: noopAuthenticator,
  //         })
  //         .add(
  //           applyTransfer(data.tx, data.opIndex, data.tx, data.opIndex, 0),
  //           { authenticator: noopAuthenticator },
  //         )
  //         .add(op("originals.apply_transfer_metadata"), {
  //           authenticator: noopAuthenticator
  //         })
  //         .buildAndSend();
  //     } catch (error) {
  //       reject(error);
  //     }

  //     resolve();


  //   await session.transactionBuilder()
  //     .add(initTransfer(
  //       session.account.id,
  //       tokenId,
  //       createAmountFromBalance(BigInt(1), 0),
  //       path,
  //       Date.now() + 60 * 60 * 24 * 1000
  //     ), {
  //       onAnchoredHandler: async (data) => {
  //         if (!data) throw new Error("No data provided");
  //         const iccfProofOperation = await data.createProof(targetChainRid);
  //         await session.transactionBuilder()
  //           .add(iccfProofOperation, {
  //             authenticator: noopAuthenticator,
  //           })
  //           .add(
  //             applyTransfer(data.tx, data.opIndex, data.tx, data.opIndex, 0),
  //             { authenticator: noopAuthenticator },
  //           )
  //           .add(op("originals.apply_transfer_metadata"), {
  //             authenticator: noopAuthenticator
  //           })
  //           .buildAndSend();
  //       }
  //     }
  //     );
  // .add(op("originals.init_transfer_metadata", metadata), {
  //       authenticator: noopAuthenticator
  //     })
  //   .buildAndSendWithAnchoring()
  //   .then((res) => {
  //     transferTransactionRid = res.receipt.transactionRid;
  //   });

  // const state = {} as any;
  // await session.transactionBuilder()
  //   .add(initTransfer(
  //     session.account.id,
  //     tokenId,
  //     createAmountFromBalance(BigInt(1), 0),
  //     path,
  //     Date.now() + 60 * 60 * 24 * 1000
  //   ), {
  //     targetBlockchainRid: session.blockchainRid,
  //     onAnchoredHandler: (data) => {
  //       state.tx = data?.tx;
  //       state.initialOpIndex = data?.opIndex;
  //       state.initialTx = data?.tx;
  //       state.opIndex = data?.opIndex;
  //       state.proof = data?.createProof(session.blockchainRid);
  //     }
  //   })
  //   .add(op("originals.init_transfer_metadata", metadata), {
  //     authenticator: noopAuthenticator
  //   })
  //   .buildAndSendWithAnchoring();

  // await dappSession.transactionBuilder()
  //   .add(applyTransfer(
  //     state.initialTx!,
  //     state.initialOpIndex!,
  //     state.tx!,
  //     state.opIndex!,
  //     0,
  //   ), {
  //     authenticator: noopAuthenticator,
  //     targetBlockchainRid: targetChainRid,
  //     onAnchoredHandler: () => { },
  //   })
  //   .add(op("originals.apply_transfer_metadata"), {
  //     authenticator: noopAuthenticator
  //   })
  //   .buildAndSendWithAnchoring();
}