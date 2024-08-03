import { IClient } from "postchain-client";
import { Token, TokenMetadata, createSerializableTokenMetadata, TTokenMetadata } from "./types";
import { BufferId, Session, createClientToBlockchain, op } from "@chromia/ft4";

export interface IQueryClient {
  getTokenMetadata(token: Token): Promise<TokenMetadata>;
}

export interface ITransactionClient {
  bridge(token: Token, amount: number, recipient: BufferId): Promise<void>;
}

// export class ReadClient implements IQueryClient {
//   constructor(protected client: IClient) {}

//   // async getTokenMetadata(token: Token): Promise<TTokenMetadata> {
//   //   return await this.client.query("yours.metadata", { collection: token.collection, token_id: token.tokenId });
//   //   // return createSerializableTokenMetadata(rawMetadata);
//   // }

//   async query(query: string, params: Record<string, any>): Promise<any> {
//     return this.client.query(query, params);
//   }
// }

// export class TransactionClient extends ReadClient implements ITransactionClient {
//   constructor(private session: Session) {
//     super(session.client);
//   }

//   async bridge(token: Token, amount: number, recipientChain: BufferId): Promise<void> {
//     const dappClient = await createClientToBlockchain(this.client, recipientChain);

//     // const metadata = await this.getTokenMetadata(token);
//     const metadata = "";

//     await this.session.transactionBuilder()
//     .add(op(
//       "yours.init_transfer",
//       this.session.account.id,
//       token.collection,
//       token.tokenId,
//       amount,
//       // metadata.toRawGtv()
//     ), {
//       onAnchoredHandler: async (data) => {
//         if (!data) throw new Error("No data provided");
//         const iccfProofOperation = await data.createProof(recipientChain);
//         await dappClient.sendTransaction({
//           operations: [
//             iccfProofOperation,
//             op(
//               "yours.apply_transfer",
//               data.tx,
//               data.opIndex
//             )
//           ],
//           signers: []
//         });
//       }
//     })
//     .buildAndSendWithAnchoring();
//   }

  // async applyTransfer(metadata: SerializableTokenMetadata): Promise<void> {
  //   await this.session.transactionBuilder()
  //     .add(op("yours.apply_transfer", metadata.toRawGtv()))
  //     .buildAndSend();
  // }
// }