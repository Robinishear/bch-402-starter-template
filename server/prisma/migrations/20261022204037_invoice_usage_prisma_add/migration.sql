-- AlterTable
ALTER TABLE "invoice" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "usage" ALTER COLUMN "userId" DROP NOT NULL;
