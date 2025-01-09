/*
  Warnings:

  - You are about to drop the column `primaryId` on the `Workout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[alternateId]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_primaryId_fkey";

-- DropIndex
DROP INDEX "Workout_primaryId_key";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "primaryId",
ADD COLUMN     "alternateId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_alternateId_key" ON "Workout"("alternateId");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_alternateId_fkey" FOREIGN KEY ("alternateId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
