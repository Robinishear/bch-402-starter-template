import { envVars } from "../../config/env";
import { ChainClient } from "./chain.interface";
import { createRealChain } from "./chain.real";
import { mockChain } from './chain.mock';

const pick = (): ChainClient => {
  if (envVars.CHAIN_MODE === "mock") {
    if (envVars.NODE_ENV === "production") {
      throw new Error("CHAIN_MODE=mock is not allowed in production");
    }
    console.warn("[chain] MOCK mode: fake addresses, no real payments");
    return mockChain;
  }
  if (envVars.CHAIN_MODE === "real") return createRealChain();
  throw new Error(`Unknown CHAIN_MODE: ${String(envVars.CHAIN_MODE)}`);
};

export const chain: ChainClient = pick();