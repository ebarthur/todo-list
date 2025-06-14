-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'inReview';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "githubPrNumber" INTEGER,
ADD COLUMN     "githubPrUrl" TEXT;
