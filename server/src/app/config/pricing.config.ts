export const FEATURE_PRICES_USD_CENTS = {
  "market-insight": 2, // $0.02
  "prompt-suggest": 1, // $0.01
} as const;

export type FeatureKey = keyof typeof FEATURE_PRICES_USD_CENTS;

export const isFeatureKey = (value: string): value is FeatureKey =>
  Object.prototype.hasOwnProperty.call(FEATURE_PRICES_USD_CENTS, value);
