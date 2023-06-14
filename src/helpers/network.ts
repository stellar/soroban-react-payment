import { StellarWalletsKit } from "stellar-wallets-kit";

export interface NetworkDetails {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
}

export enum Networks {
  Futurenet = "FUTURENET",
}

export const signTx = async (
  xdr: string,
  publicKey: string,
  kit: StellarWalletsKit,
) => {
  const { signedXDR } = await kit.sign({
    xdr,
    publicKey,
  });
  return signedXDR;
};
