/*
  Warnings:

  - A unique constraint covering the columns `[alternateAId]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "alternateAId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_alternateAId_key" ON "Workout"("alternateAId");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_alternateAId_fkey" FOREIGN KEY ("alternateAId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
