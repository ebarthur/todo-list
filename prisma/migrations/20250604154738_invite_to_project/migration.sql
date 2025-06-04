/*
  Warnings:

  - Added the required column `projectId` to the `InviteToken` table without a default value. This is not possible if the table is not empty.

*/

ALTER TABLE "InviteToken" ADD COLUMN "projectId" INTEGER ;

UPDATE "InviteToken" SET "projectId" = (SELECT id FROM "Project" ORDER BY id LIMIT 1);

-- AlterTable
ALTER TABLE "InviteToken" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "InviteToken" ADD CONSTRAINT "InviteToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
