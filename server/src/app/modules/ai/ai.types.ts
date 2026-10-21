import { FeatureKey } from "../../config/pricing.config";

export type AiResult = {
  text: string;
  tokens?: number;
  truncated: boolean; 
};

export interface AiProvider {
  run(feature: FeatureKey, input: string): Promise<AiResult>;
}