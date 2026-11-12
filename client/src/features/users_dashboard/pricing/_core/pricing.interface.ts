export interface FeaturePricing {
  feature: string;
  priceUsdCents: number;
  amountSats: string;
}

export interface PricingData {
  bchUsdRate: string;
  features: FeaturePricing[];
}
export interface PricingApiResponse {
  success: boolean;
  message: string;
  data: PricingData;
}