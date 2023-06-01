import * as SorobanClient from "soroban-client";
import { NetworkDetails } from "./network";
import { stroopToXlm } from "./format";
import { I128 } from "./xdr";

// TODO: once soroban supports estimated fees, we can fetch this
export const BASE_FEE = "100";
export const baseFeeXlm = stroopToXlm(BASE_FEE).toString();

export const RPC_URLS: { [key: string]: string } = {
  FUTURENET: "https://rpc-futurenet.stellar.org/",
};

export const accountToScVal = (account: string) =>
  new SorobanClient.Address(account).toScVal();

export const decodeBytesN = (xdr: string) => {
  const val = SorobanClient.xdr.ScVal.fromXDR(xdr, "base64");
  return val.bytes().toString();
};

export const decodei128 = (xdr: string) => {
  const value = SorobanClient.xdr.ScVal.fromXDR(xdr, "base64");
  return new I128([
    BigInt(value.i128().lo().low),
    BigInt(value.i128().lo().high),
    BigInt(value.i128().hi().low),
    BigInt(value.i128().hi().high),
  ]).toString();
};

export const decoders = {
  bytesN: decodeBytesN,
  i128: decodei128,
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
  decoder: (xdr: string) => string,
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

export const getTokenName = async (
  tokenId: string,
  txBuilder: SorobanClient.TransactionBuilder,
  networkDetails: NetworkDetails,
) => {
  const server = getServer(networkDetails);
  const contract = new SorobanClient.Contract(tokenId);
  const tx = txBuilder
    .addOperation(contract.call("name"))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const result = await simulateTx(tx, decoders.bytesN, server);
  return result;
};

export const getTokenBalance = async (
  address: string,
  tokenId: string,
  txBuilder: SorobanClient.TransactionBuilder,
  networkDetails: NetworkDetails,
) => {
  const params = [accountToScVal(address)];
  const server = getServer(networkDetails);
  const contract = new SorobanClient.Contract(tokenId);
  const tx = txBuilder
    .addOperation(contract.call("balance", ...params))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const result = await simulateTx(tx, decoders.i128, server);
  return result;
};
