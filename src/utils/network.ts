import freighterApi from "@stellar/freighter-api";
// import * as SorobanClient from "soroban-client";

export enum Networks {
  Futurenet = 'Futurenet',
}

export async function connectNetwork() {
  const networkDetails = await freighterApi.getNetwork()
  const pubKey = await freighterApi.getPublicKey()

  // const server = new SorobanClient.Server(networkDetails.networkUrl, {
  //   allowHttp: networkDetails.networkUrl.startsWith("http://"),
  // })
  console.log(networkDetails, pubKey)
}