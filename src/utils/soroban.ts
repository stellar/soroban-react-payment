import * as SorobanClient from "soroban-client";
import { NetworkDetails } from "./network";

export const RPC_URLS: { [key: string]: string } = {
  FUTURENET: "https://rpc-futurenet.stellar.org/",
};

export const decodeBytesN = (scVal: string) => {
  const val = SorobanClient.xdr.ScVal.fromXDR(scVal, "base64");
  return val.bytes().toString();
};

export const decoders = {
  bytesN: decodeBytesN,
};

export const getServer = (networkDetails: NetworkDetails) =>
  new SorobanClient.Server(RPC_URLS[networkDetails.network], {
    allowHttp: networkDetails.networkUrl.startsWith("http://"),
  });

export const getTxBuilder = (
  pubKey: string,
  fee: string,
  networkPassphrase: string,
) => {
  const source = new SorobanClient.Account(pubKey, "0");
  return new SorobanClient.TransactionBuilder(source, {
    fee,
    networkPassphrase,
  });
};

export const simulateTx = async (
  tx: SorobanClient.Transaction<
    SorobanClient.Memo<SorobanClient.MemoType>,
    SorobanClient.Operation[]
  >,
  decoder: (scVal: string) => string,
  server: SorobanClient.Server,
) => {
  const { results } = await server.simulateTransaction(tx);
  if (!results || results.length !== 1) {
    throw new Error("Invalid response from simulateTransaction");
  }
  const result = results[0];
  return decoder(result.xdr);
};

export const getTokenSymbol = async (
  tokenId: string,
  txBuilder: SorobanClient.TransactionBuilder,
  networkDetails: NetworkDetails,
) => {
  const server = getServer(networkDetails);
  const contract = new SorobanClient.Contract(tokenId);
  const tx = txBuilder
    .addOperation(contract.call("symbol"))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const result = await simulateTx(tx, decoders.bytesN, server);
  return result;
};
