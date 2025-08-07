/*
  Warnings:

  - You are about to drop the column `workoutId` on the `template_workout` table. All the data in the column will be lost.
  - You are about to drop the column `workoutId` on the `weightentry` table. All the data in the column will be lost.
  - You are about to drop the `workout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "template_workout" DROP CONSTRAINT "template_workout_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "weightentry" DROP CONSTRAINT "weightentry_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "workout" DROP CONSTRAINT "workout_alternateId_fkey";

-- DropForeignKey
ALTER TABLE "workout" DROP CONSTRAINT "workout_related_fkey";

-- DropForeignKey
ALTER TABLE "workout" DROP CONSTRAINT "workout_supersettedId_fkey";

-- DropForeignKey
ALTER TABLE "workout" DROP CONSTRAINT "workout_userId_fkey";

-- DropIndex
DROP INDEX "template_workout_templateId_workoutId_key";

-- AlterTable
ALTER TABLE "template_workout" DROP COLUMN "workoutId";

-- AlterTable
ALTER TABLE "weightentry" DROP COLUMN "workoutId";

-- DropTable
DROP TABLE "workout";
