-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '1 hour';

-- AlterTable
ALTER TABLE "weightentry" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
