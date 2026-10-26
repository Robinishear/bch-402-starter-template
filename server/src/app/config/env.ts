import dotenv from "dotenv";
import status from "http-status";
import AppError from "../error-helpers/AppError";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;

  DATABASE_URL: string;
  FRONTEND_ORIGIN: string;
  REDIS_URL: string;

  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  CHAIN_MODE: string;

  AUTH: {
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
  };

  OAUTH: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
  };

  BCH: {
    BCH_NETWORK: "mainnet" | "testnet";
    BCH_XPUB: string;
    CHAIN_API_URL: string;
    PRICE_API_URL: string;
  };
  AI: {
    AI_PROVIDER: "gemini" | "openai";
    GEMINI_API_KEY: string;
    GEMINI_MODEL: string;
  };

  EMAIL: {
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  EMAIL_FROM: string;
};
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "FRONTEND_ORIGIN",
    // "REDIS_URL",
    
     "CHAIN_MODE",

    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",


    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",

    "BCH_NETWORK",
    "BCH_XPUB",
    "CHAIN_API_URL",
    "PRICE_API_URL",

    "AI_PROVIDER",
    "GEMINI_API_KEY",
    // "GEMINI_MODEL",

    "SMTP_HOST",
"SMTP_PORT",
"SMTP_USER",
"SMTP_PASS",
"EMAIL_FROM",
  ];

  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]?.trim()) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`,
      );
    }
  });

  const bchNetwork = process.env.BCH_NETWORK;

  if (bchNetwork !== "mainnet" && bchNetwork !== "testnet") {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "BCH_NETWORK must be either mainnet or testnet.",
    );
  }

  const aiProvider = process.env.AI_PROVIDER;

  if (aiProvider !== "gemini" && aiProvider !== "openai") {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "AI_PROVIDER must be either gemini or openai.",
    );
  }

  if (aiProvider === "gemini" && !process.env.GEMINI_API_KEY?.trim()) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "GEMINI_API_KEY is required when AI_PROVIDER is gemini.",
    );
  }

  if (aiProvider === "openai" && !process.env.GEMINI_MODEL?.trim()) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "GEMINI_MODEL is required when AI_PROVIDER is openai.",
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,

    DATABASE_URL: process.env.DATABASE_URL as string,
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN as string,
    REDIS_URL: process.env.REDIS_URL as string,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    
        CHAIN_MODE: process.env.CHAIN_MODE as string,

    


    AUTH: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    },

    OAUTH: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,
    },

    BCH: {
      BCH_NETWORK: bchNetwork as "mainnet" | "testnet",
      BCH_XPUB: process.env.BCH_XPUB as string,
      CHAIN_API_URL: process.env.CHAIN_API_URL as string,
      PRICE_API_URL: process.env.PRICE_API_URL as string,
    },

    AI: {
      AI_PROVIDER: aiProvider as "gemini" | "openai",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
      GEMINI_MODEL: process.env.GEMINI_MODEL ?? "",
    },

    EMAIL: {
  SMTP_HOST: process.env.SMTP_HOST as string,
  SMTP_PORT: process.env.SMTP_PORT as string,
  SMTP_USER: process.env.SMTP_USER as string,
  SMTP_PASS: process.env.SMTP_PASS as string,
  EMAIL_FROM: process.env.EMAIL_FROM as string,
},
  };
};

export const envVars = loadEnvVariables();
