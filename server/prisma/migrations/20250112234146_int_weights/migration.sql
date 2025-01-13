/*
  Warnings:

  - You are about to alter the column `weight` on the `weightentry` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "weightentry" ALTER COLUMN "weight" SET DATA TYPE INTEGER;
