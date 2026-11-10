import rateLimit from "express-rate-limit";
import { Request } from "express";
import { envVars } from "./env";

const tooMany = {
  success: false,
  message: "Too many requests. Please try again later.",
};

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

export const createInvoiceLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 10,
  keyGenerator: (req: Request) => req.user!.userId,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: tooMany,
});

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: envVars.NODE_ENV === "production" ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: tooMany,

});


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


export const forgotPasswordCooldown = rateLimit({
  windowMs: 60 * 1000,
  limit: 1,
  keyGenerator: (req) => String(req.body?.email ?? "").toLowerCase(),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Please wait 60 seconds before requesting another OTP." },
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});