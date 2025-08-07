/*
  Warnings:

  - You are about to drop the column `type` on the `workout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workout" DROP COLUMN "type";

-- DropEnum
DROP TYPE "split";
