/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeightEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WeightEntry" DROP CONSTRAINT "WeightEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "WeightEntry" DROP CONSTRAINT "WeightEntry_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_alternateId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_supersettedId_fkey";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "WeightEntry";

-- DropTable
DROP TABLE "Workout";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" TEXT NOT NULL,
    "amrap" BOOLEAN NOT NULL DEFAULT false,
    "type" "split" NOT NULL,
    "supersettedId" INTEGER,
    "alternateId" INTEGER,

    CONSTRAINT "workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weightentry" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weightentry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "workout_supersettedId_key" ON "workout"("supersettedId");

-- CreateIndex
CREATE UNIQUE INDEX "workout_alternateId_key" ON "workout"("alternateId");

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_supersettedId_fkey" FOREIGN KEY ("supersettedId") REFERENCES "workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_alternateId_fkey" FOREIGN KEY ("alternateId") REFERENCES "workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weightentry" ADD CONSTRAINT "weightentry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weightentry" ADD CONSTRAINT "weightentry_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
