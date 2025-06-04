/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `ProjectAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/

ALTER TABLE "Notification" ADD COLUMN "projectId" INTEGER;

UPDATE "Notification" SET "projectId" = (SELECT id FROM "Project" ORDER BY id LIMIT 1);

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "projectId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAccess_userId_projectId_key" ON "ProjectAccess"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
