/*
  Warnings:

  - You are about to drop the column `isGlobal` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `isTemplate` on the `workout` table. All the data in the column will be lost.
  - Made the column `userId` on table `workout` required. This step will fail if there are existing NULL values in that column.

*/

-- Delete all global workouts (those with NULL userId) first
DELETE FROM "workout" WHERE "userId" IS NULL;

-- Delete any weight entries that might be orphaned
DELETE FROM "weightentry" WHERE "workoutId" NOT IN (SELECT "id" FROM "workout");

-- AlterTable
ALTER TABLE "workout" DROP COLUMN "isGlobal",
DROP COLUMN "isTemplate",
ALTER COLUMN "userId" SET NOT NULL;
