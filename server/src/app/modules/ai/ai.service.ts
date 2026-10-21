import status from "http-status";
import { envVars } from "../../config/env";
import AppError from "../../error-helpers/AppError";
import { AiProvider, AiResult } from "./ai.types";
import { geminiProvider } from "./providers/gemini.provider";
import { FeatureKey } from "../../config/pricing.config";

export const MAX_INPUT_CHARS = 500;

const providers: Record<string, AiProvider> = {
  gemini: geminiProvider,
// next opn ai add
};

const run = async (feature: FeatureKey, rawInput: string): Promise<AiResult> => {
  const input = rawInput.trim();
  if (!input) {
    throw new AppError(status.BAD_REQUEST, "Input is required.");
  }
  if (input.length > MAX_INPUT_CHARS) {
    throw new AppError(
      status.BAD_REQUEST,
      `Input must be at most ${MAX_INPUT_CHARS} characters.`,
    );
  }

  const provider = providers[envVars.AI.AI_PROVIDER];
  if (!provider) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "AI provider not configured.");
  }
  return provider.run(feature, input);
};

export const AiService = { run };