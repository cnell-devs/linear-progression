-- DropForeignKey
ALTER TABLE "weightentry" DROP CONSTRAINT "weightentry_workoutId_fkey";

-- AddForeignKey
ALTER TABLE "weightentry" ADD CONSTRAINT "weightentry_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
