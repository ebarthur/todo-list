-- DropForeignKey
ALTER TABLE "InviteToken" DROP CONSTRAINT "InviteToken_projectId_fkey";

-- AddForeignKey
ALTER TABLE "InviteToken" ADD CONSTRAINT "InviteToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
