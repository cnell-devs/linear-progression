/*
  Warnings:

  - You are about to drop the column `initialReps` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `initialSets` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `reps` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sets` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "initialReps",
DROP COLUMN "initialSets",
ADD COLUMN     "reps" TEXT NOT NULL,
ADD COLUMN     "sets" INTEGER NOT NULL;
