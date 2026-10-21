export const FEATURE_PRICES_USD_CENTS = {
  "market-insight": 3, // $0.03
  "prompt-suggest": 2, // $0.02
} as const;

export type FeatureKey = keyof typeof FEATURE_PRICES_USD_CENTS;

export const isFeatureKey = (value: string): value is FeatureKey =>
  Object.prototype.hasOwnProperty.call(FEATURE_PRICES_USD_CENTS, value);
