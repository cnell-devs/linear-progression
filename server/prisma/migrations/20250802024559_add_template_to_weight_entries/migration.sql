-- AlterTable
ALTER TABLE "weightentry" ADD COLUMN     "templateId" INTEGER;

-- AddForeignKey
ALTER TABLE "weightentry" ADD CONSTRAINT "weightentry_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workout_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
