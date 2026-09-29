/*
  Warnings:

  - A unique constraint covering the columns `[templateId,userWorkoutId]` on the table `template_workout` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "template_workout" ADD COLUMN     "userWorkoutId" INTEGER,
ALTER COLUMN "workoutId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "weightentry" ADD COLUMN     "userWorkoutId" INTEGER,
ALTER COLUMN "workoutId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "global_workouts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "muscleGroup" TEXT,
    "equipment" TEXT,
    "description" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workouts" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "globalWorkoutId" INTEGER,
    "customName" TEXT,
    "userCreated" BOOLEAN NOT NULL DEFAULT false,
    "pendingApproval" BOOLEAN NOT NULL DEFAULT false,
    "supersettedId" INTEGER,
    "alternateId" INTEGER,
    "alt" BOOLEAN NOT NULL DEFAULT false,
    "ss" BOOLEAN NOT NULL DEFAULT false,
    "workoutId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_workouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "global_workouts_name_key" ON "global_workouts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_workouts_supersettedId_key" ON "user_workouts"("supersettedId");

-- CreateIndex
CREATE UNIQUE INDEX "user_workouts_alternateId_key" ON "user_workouts"("alternateId");

-- CreateIndex
CREATE UNIQUE INDEX "template_workout_templateId_userWorkoutId_key" ON "template_workout"("templateId", "userWorkoutId");

-- AddForeignKey
ALTER TABLE "global_workouts" ADD CONSTRAINT "global_workouts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_globalWorkoutId_fkey" FOREIGN KEY ("globalWorkoutId") REFERENCES "global_workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_alternateId_fkey" FOREIGN KEY ("alternateId") REFERENCES "user_workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workout_related_fkey" FOREIGN KEY ("workoutId") REFERENCES "user_workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_supersettedId_fkey" FOREIGN KEY ("supersettedId") REFERENCES "user_workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_workout" ADD CONSTRAINT "template_workout_userWorkoutId_fkey" FOREIGN KEY ("userWorkoutId") REFERENCES "user_workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weightentry" ADD CONSTRAINT "weightentry_userWorkoutId_fkey" FOREIGN KEY ("userWorkoutId") REFERENCES "user_workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
