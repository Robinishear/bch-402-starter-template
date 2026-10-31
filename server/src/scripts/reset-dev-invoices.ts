import "dotenv/config";
import { envVars } from "../app/config/env";
import { prisma } from "../app/lib/prisma";

const START_INDEX = 10;

(async () => {
  if (envVars.NODE_ENV === "production") {
    throw new Error("production-এ এটা চালানো যাবে না");
  }
  if (!process.argv.includes("--yes")) {
    throw new Error("এটা সব ইনভয়েস ও usage মুছে ফেলে। নিশ্চিত হলে শেষে --yes দিন");
  }

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "usage", "invoice" RESTART IDENTITY CASCADE`);
  await prisma.$queryRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"invoice"', 'derivIndex'), ${START_INDEX - 1}, true)`,
  );

  console.log(`✅ ইনভয়েস মোছা হয়েছে। পরের ঠিকানা-নম্বর হবে ${START_INDEX}`);
  process.exit(0);
})().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});