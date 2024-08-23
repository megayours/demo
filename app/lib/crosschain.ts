import { Session, noopAuthenticator, op } from "@chromia/ft4";
import { serializeTokenMetadata, TokenMetadata } from "../types/nft";

export async function bridgeNFT(session: Session | undefined, project: string, collection: string, tokenId: number, targetSession: Session) {
  if (!session) return;

  const metadata = await session.query<TokenMetadata>("yours.metadata", { project, collection, token_id: tokenId });
  console.log(`Metadata: ${JSON.stringify(metadata)}`);

  return new Promise<void>(async (resolve, reject) => {
    try {
      await session.transactionBuilder()
        .add(op(
          "yours.init_transfer",
          targetSession.account.id,
          metadata.yours.project,
          metadata.yours.collection,
          tokenId,
          1,
          serializeTokenMetadata(metadata)
        ), {
          onAnchoredHandler: async (initData: any) => {
            if (!initData) throw new Error("No data provided after init_transfer");
            const iccfProofOperation = await initData.createProof(targetSession.blockchainRid);
            await targetSession.transactionBuilder()
              .add(iccfProofOperation, {
                authenticator: noopAuthenticator,
              })
              .add(op(
                "yours.apply_transfer",
                initData.tx,
                initData.opIndex
              ), {
                authenticator: noopAuthenticator,
                onAnchoredHandler: async (applyData: any) => {
                  if (!applyData) throw new Error("No data provided after apply_transfer");
                  const iccfProofOperation = await applyData.createProof(session.blockchainRid);
                  await session.transactionBuilder()
                    .add(iccfProofOperation, {
                      authenticator: noopAuthenticator,
                    })
                    .add(op(
                      "yours.complete_transfer",
                      applyData.tx,
                      applyData.opIndex
                    ), {
                      authenticator: noopAuthenticator,
                    })
                    .buildAndSend();
                }
              })
              .buildAndSendWithAnchoring();

            resolve();
          }
        })
        .buildAndSendWithAnchoring();
    } catch (error) {
      reject(error);
    }
  });
}
