-- DropForeignKey
ALTER TABLE "weightentry" DROP CONSTRAINT "weightentry_userId_fkey";

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '1 hour';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLogin" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "weightentry" ADD CONSTRAINT "weightentry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
