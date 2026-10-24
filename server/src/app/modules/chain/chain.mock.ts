import { randomUUID } from "node:crypto";
import { ChainClient, Payment } from "./chain.interface";

const ledger = new Map<string, Payment[]>(); 

type MockChain = ChainClient & {
  simulatePayment(address: string, valueSats: bigint, txid?: string): string;
};

export const mockChain: MockChain = {
  deriveAddress: (index) => `mock:address-${index}`,

  async findPaymentsToMany(addresses) {
    const out: Record<string, Payment[]> = {};
    for (const address of addresses) {
      const payments = ledger.get(address);
      if (payments?.length) out[address] = payments;
    }
    return out;
  },

  simulatePayment(address, valueSats, txid = `mock-tx-${randomUUID()}`) {
    const list = ledger.get(address) ?? [];
    list.push({ txid, valueSats, confirmations: 0 });
    ledger.set(address, list);
    return txid;
  },
};