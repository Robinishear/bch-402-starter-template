import "dotenv/config";
import { Server } from "http";
import { app } from "./app";
import { envVars } from "./app/config/env";
import { prisma } from "./app/lib/prisma";
import { startInvoiceSweeper, stopInvoiceSweeper } from "./workers/invoiceSweeper";
import { startPaymentWatcher, stopPaymentWatcher } from "./workers/paymentWatcher";


let server: Server | null = null;
let shuttingDown = false;

const SHUTDOWN_TIMEOUT_MS = 100_000;

const bootstrap = async () => {
  try {
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
      startInvoiceSweeper();
      startPaymentWatcher();

    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

const shutdown = (reason: string, exitCode: number) => {
  if (shuttingDown) {
    console.log("Second signal: forcing exit");
    process.exit(1);
  }
  shuttingDown = true;
  console.log(`${reason}: closing HTTP server`);
  stopInvoiceSweeper();
  stopPaymentWatcher();


  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();

  const finish = () =>
    prisma.$disconnect().finally(() => process.exit(exitCode));

  if (!server) return void finish();
  server.close(() => {
    console.log("HTTP server closed");
    void finish();
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM received", 0));
process.on("SIGINT", () => shutdown("SIGINT received", 0));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("uncaughtException", 1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  shutdown("unhandledRejection", 1);
});

bootstrap();