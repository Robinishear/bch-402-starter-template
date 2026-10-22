export type Payment = { txid: string; valueSats: bigint; confirmations: number };

export interface ChainClient {
  deriveAddress(index: number): string;
  findPaymentsTo(address: string): Promise<Payment[]>;
}