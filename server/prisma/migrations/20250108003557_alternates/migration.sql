/*
  Warnings:

  - You are about to drop the column `alternateAId` on the `Workout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[primaryId]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_alternateAId_fkey";

-- DropIndex
DROP INDEX "Workout_alternateAId_key";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "alternateAId",
ADD COLUMN     "primaryId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_primaryId_key" ON "Workout"("primaryId");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_primaryId_fkey" FOREIGN KEY ("primaryId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
