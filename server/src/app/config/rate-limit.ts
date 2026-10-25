import rateLimit from "express-rate-limit";
import { Request } from "express";
import { envVars } from "./env";

const tooMany = {
  success: false,
  message: "Too many requests. Please try again later.",
};

// Only failed logins are counted (to prevent password guessing)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: tooMany,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60_000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: tooMany,
});

// user 
export const createInvoiceLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 10,
  keyGenerator: (req: Request) => req.user!.userId,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: tooMany,
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: envVars.NODE_ENV === "production" ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

export { limiter };

export const publicCreateLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 5,
  skip: (req) => Boolean(req.header("x-invoice-id")),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: tooMany,
});

export const publicPollLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  skip: (req) => !req.header("x-invoice-id"),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: tooMany,
});