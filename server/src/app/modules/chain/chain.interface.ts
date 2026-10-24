export type Payment = { txid: string; valueSats: bigint; confirmations: number };

export interface ChainClient {
  deriveAddress(index: number): string;
  findPaymentsToMany(addresses: string[]): Promise<Record<string, Payment[]>>;
}