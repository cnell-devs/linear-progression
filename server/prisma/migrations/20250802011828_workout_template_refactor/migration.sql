/*
  Warnings:

  - You are about to drop the column `amrap` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `workout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "workout" DROP CONSTRAINT "workout_templateId_fkey";

-- AlterTable
ALTER TABLE "workout" DROP COLUMN "amrap",
DROP COLUMN "reps",
DROP COLUMN "sets",
DROP COLUMN "templateId";

-- CreateTable
CREATE TABLE "template_workout" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" TEXT NOT NULL,
    "amrap" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "template_workout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_workout_templateId_workoutId_key" ON "template_workout"("templateId", "workoutId");

-- AddForeignKey
ALTER TABLE "template_workout" ADD CONSTRAINT "template_workout_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workout_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_workout" ADD CONSTRAINT "template_workout_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
