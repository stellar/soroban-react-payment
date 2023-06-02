import * as SorobanClient from "soroban-client";
import BigNumber from "bignumber.js";
import { NetworkDetails } from "./network";
import { stroopToXlm } from "./format";
import { I128 } from "./xdr";

// TODO: once soroban supports estimated fees, we can fetch this
export const BASE_FEE = "100";
export const baseFeeXlm = stroopToXlm(BASE_FEE).toString();
export const XLM_DECIMALS = 7;

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
  try {
    return new I128([
      BigInt(value.i128().lo().low),
      BigInt(value.i128().lo().high),
      BigInt(value.i128().hi().low),
      BigInt(value.i128().hi().high),
    ]).toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const decodeu32 = (xdr: string) => {
  const val = SorobanClient.xdr.ScVal.fromXDR(xdr, "base64");
  return val.u32();
};

export const decoders = {
  bytesN: decodeBytesN,
  i128: decodei128,
  u32: decodeu32,
};

const bigintToBuf = (bn: bigint): Buffer => {
  let hex = BigInt(bn).toString(16).replace(/^-/, "");
  if (hex.length % 2) {
    hex = `0${hex}`;
  }

  const len = hex.length / 2;
  const u8 = new Uint8Array(len);

  let i = 0;
  let j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  if (bn < BigInt(0)) {
    // Set the top bit
    u8[0] |= 0x80;
  }

  return Buffer.from(u8);
};

const bigNumberFromBytes = (
  signed: boolean,
  ...bytes: (string | number | bigint)[]
): BigNumber => {
  let sign = 1;
  if (signed && bytes[0] === 0x80) {
    // top bit is set, negative number.
    sign = -1;
    bytes[0] &= 0x7f;
  }
  let b = BigInt(0);
  for (const byte of bytes) {
    b <<= BigInt(8);
    b |= BigInt(byte);
  }
  return BigNumber(b.toString()).multipliedBy(sign);
};

export const numberToI128 = (value: number): SorobanClient.xdr.ScVal => {
  const bigValue = BigNumber(value);
  const b: bigint = BigInt(bigValue.toFixed(0));
  const buf = bigintToBuf(b);
  if (buf.length > 16) {
    throw new Error("BigNumber overflows i128");
  }

  if (bigValue.isNegative()) {
    // Clear the top bit
    buf[0] &= 0x7f;
  }

  // left-pad with zeros up to 16 bytes
  const padded = Buffer.alloc(16);
  buf.copy(padded, padded.length - buf.length);
  console.debug({ value: value.toString(), padded });

  if (bigValue.isNegative()) {
    // Set the top bit
    padded[0] |= 0x80;
  }

  const hi = new SorobanClient.xdr.Int64(
    bigNumberFromBytes(false, ...padded.slice(4, 8)).toNumber(),
    bigNumberFromBytes(false, ...padded.slice(0, 4)).toNumber(),
  );
  const lo = new SorobanClient.xdr.Uint64(
    bigNumberFromBytes(false, ...padded.slice(12, 16)).toNumber(),
    bigNumberFromBytes(false, ...padded.slice(8, 12)).toNumber(),
  );

  return SorobanClient.xdr.ScVal.scvI128(
    new SorobanClient.xdr.Int128Parts({ lo, hi }),
  );
};

export const parseTokenAmount = (value: string, decimals: number) => {
  const comps = value.split(".");

  let whole = comps[0];
  let fraction = comps[1];
  if (!whole) {
    whole = "0";
  }
  if (!fraction) {
    fraction = "0";
  }

  // Trim trailing zeros
  while (fraction[fraction.length - 1] === "0") {
    fraction = fraction.substring(0, fraction.length - 1);
  }

  // If decimals is 0, we have an empty string for fraction
  if (fraction === "") {
    fraction = "0";
  }

  // Fully pad the string with zeros to get to value
  while (fraction.length < decimals) {
    fraction += "0";
  }

  const wholeValue = new BigNumber(whole);
  const fractionValue = new BigNumber(fraction);

  return wholeValue.shiftedBy(decimals).plus(fractionValue);
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

export const simulateTx = async <ArgType>(
  tx: SorobanClient.Transaction<
    SorobanClient.Memo<SorobanClient.MemoType>,
    SorobanClient.Operation[]
  >,
  decoder: (xdr: string) => ArgType,
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

  const result = await simulateTx<string>(tx, decoders.bytesN, server);
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

export const getTokenDecimals = async (
  tokenId: string,
  txBuilder: SorobanClient.TransactionBuilder,
  networkDetails: NetworkDetails,
) => {
  const server = getServer(networkDetails);
  const contract = new SorobanClient.Contract(tokenId);
  const tx = txBuilder
    .addOperation(contract.call("decimals"))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const result = await simulateTx<number>(tx, decoders.u32, server);
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

export const makePayment = async (
  tokenId: string,
  amount: number,
  to: string,
  pubKey: string,
  txBuilder: SorobanClient.TransactionBuilder,
  networkDetails: NetworkDetails,
) => {
  const server = getServer(networkDetails);
  const contract = new SorobanClient.Contract(tokenId);
  const tx = txBuilder
    .addOperation(
      contract.call(
        "transfer",
        ...[
          accountToScVal(pubKey), // from
          accountToScVal(to), // to
          numberToI128(amount), // amount
        ],
      ),
    )
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const preparedTransaction = await server.prepareTransaction(
    tx,
    networkDetails.networkPassphrase,
  );

  return preparedTransaction.toXDR();
};
