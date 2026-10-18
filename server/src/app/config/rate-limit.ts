import rateLimit from "express-rate-limit";
import { envVars } from "./env";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: envVars.NODE_ENV === "production" ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

export { limiter };

