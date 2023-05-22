import freighterApi from "@stellar/freighter-api";

export enum Networks {
  Futurenet = 'FUTURENET',
}

export async function connectNetwork() {
  const networkDetails = await freighterApi.getNetworkDetails()
  const pubKey = await freighterApi.getPublicKey()

  return {
    networkDetails,
    pubKey
  }
}