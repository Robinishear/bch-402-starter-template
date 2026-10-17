/*
  Warnings:

  - You are about to drop the column `needPasswordChange` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "needPasswordChange",
DROP COLUMN "password";
