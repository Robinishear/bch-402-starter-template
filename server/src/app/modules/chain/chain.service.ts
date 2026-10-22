import { envVars } from "../../config/env";
import { ChainClient } from "./chain.interface";
import { mockChain } from "./chain.mock";

const pick = (): ChainClient => {
  if (envVars.CHAIN_MODE === "mock") {
    if (envVars.NODE_ENV === "production") {
      throw new Error("CHAIN_MODE=mock is not allowed in production");
    }
    console.warn("[chain] MOCK mode: fake addresses, no real payments");
    return mockChain;
  }
  throw new Error("Real chain client is not implemented yet");
};

export const chain: ChainClient = pick();