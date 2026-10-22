import { ChainClient } from "./chain.interface";

export const mockChain: ChainClient = {
  deriveAddress: (index) => `mock:address-${index}`,
  findPaymentsTo: async () => [],
};