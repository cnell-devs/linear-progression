-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '1 hour';
