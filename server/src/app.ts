import cookieParser from "cookie-parser";
import helmet from "helmet";
import qs from "qs";
import express, { Application, Request, Response } from "express";
import { cors } from "./app/config/cors";
import { logger } from "./app/config/logger";
import { limiter } from "./app/config/rate-limit";
import { apiRoutes } from "./app/routes";
import { toNodeHandler } from "better-auth/node";
import path from "path";
// import { authRoutes } from "./modules/auth/auth.route";
import { auth } from "./app/lib/auth";
import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";

const app: Application = express();

app.set("query parser", (str: string) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/templates`));

app.use(cors);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },

    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "object-src": ["'none'"],
      },
    },

    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

app.use(express.json());
app.use(logger);
app.use(limiter);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    title: "Welcome to your Express app",
    description:
      "Built with A production-ready Express template with TypeScript, security, and best practices.",
    version: "1.0.0",
    docs: "https://github.com/Robinishear",
  });
});

// app.use("/api/v1/auth", authRoutes);
app.use("/api/auth-extra", (req, res) => {
  return toNodeHandler(auth)(req, res);
});
app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export { app };
