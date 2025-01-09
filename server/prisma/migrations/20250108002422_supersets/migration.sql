/*
  Warnings:

  - A unique constraint covering the columns `[supersettedId]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "supersettedId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_supersettedId_key" ON "Workout"("supersettedId");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_supersettedId_fkey" FOREIGN KEY ("supersettedId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
