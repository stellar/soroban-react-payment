import {
  Memo,
  MemoType,
  Operation,
  Server,
  Transaction,
  TransactionBuilder,
} from "soroban-client";
import * as SorobanHelpers from "../soroban";
import { FUTURENET_DETAILS } from "../network";

describe("Soroban Helpers - ", () => {
  const PUB_KEY = "GCGORBD5DB4JDIKVIA536CJE3EWMWZ6KBUBWZWRQM7Y3NHFRCLOKYVAL";
  const FEE = "100";

  describe("getServer", () => {
    test("should return a SorobanClient.Server configured to the passed in network details", async () => {
      const server = SorobanHelpers.getServer(FUTURENET_DETAILS);
      const configuredNetwork = await server.getNetwork();
      expect(configuredNetwork.passphrase).toEqual(
        FUTURENET_DETAILS.networkPassphrase,
      );
    });
  });

  describe("getTxBuilder", () => {
    const server = SorobanHelpers.getServer(FUTURENET_DETAILS);

    test("should return a SorobanClient.TransactionBuilder configured to the passed in source account and network", async () => {
      const builder = await SorobanHelpers.getTxBuilder(
        PUB_KEY,
        FEE,
        server,
        FUTURENET_DETAILS.networkPassphrase,
      );
      expect(builder).toHaveProperty("addOperation");
      expect(builder).toHaveProperty("addMemo");
      expect(builder).toHaveProperty("build");
    });
  });

  describe("simulateTx", () => {
    const TEST_XDR =
      "AAAAAgAAAACM6IR9GHiRoVVAO78JJNksy2fKDQNs2jBn8bacsRLcrAAAAGQAALDTAAAAmQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAACAAAAEgAAAAGvUaDMj6075hfTiVH7DPAwLD7vh/GD+dlkZfp6o9gqdgAAAA8AAAAGc3ltYm9sAAAAAAAAAAAAAAAAAAA=";
    const testTx = TransactionBuilder.fromXDR(
      TEST_XDR,
      FUTURENET_DETAILS.networkPassphrase,
    ) as Transaction<Memo<MemoType>, Operation[]>;
    const mockSimResult = {
      auth: [],
      xdr: "AAAAAwAAAAA=",
    };
    const mockSim = jest.fn(
      (_tx: Transaction<Memo<MemoType>, Operation[]>) => ({
        results: [mockSimResult],
      }),
    );
    const mockServer = {
      simulateTransaction: mockSim,
    } as any as Server;

    test("should take tx/server and return a native type according to the generic type argument", async () => {
      const result = await SorobanHelpers.simulateTx<number>(
        testTx,
        mockServer,
      );
      expect(typeof result).toEqual("number");
    });
  });
});
