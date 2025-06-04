/*
  Warnings:

  - Added the required column `projectId` to the `InviteToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/


-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Project" ("name", "slug", "createdAt", "updatedAt")
VALUES ('Good Stuff', 'good-stuff', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


ALTER TABLE "InviteToken" ADD COLUMN     "projectId" INTEGER;
ALTER TABLE "Notification" ADD COLUMN     "projectId" INTEGER;
ALTER TABLE "Task" ADD COLUMN     "projectId" INTEGER;

UPDATE "Task"
SET "projectId" = (SELECT id FROM "Project" LIMIT 1);

UPDATE "Notification"
SET "projectId" = (SELECT id FROM "Project" LIMIT 1);

UPDATE "InviteToken"
SET "projectId" = (SELECT id FROM "Project" LIMIT 1);

ALTER TABLE "InviteToken" ALTER COLUMN "projectId" SET NOT NULL;

ALTER TABLE "Notification" ALTER COLUMN "projectId" SET NOT NULL;

ALTER TABLE "Task" ALTER COLUMN "projectId" SET NOT NULL;

-- CreateTable
CREATE TABLE "ProjectAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAccess_pkey" PRIMARY KEY ("id")
);

INSERT INTO "ProjectAccess" ("userId", "projectId", "createdAt")
SELECT id, (SELECT id FROM "Project" LIMIT 1), CURRENT_TIMESTAMP
FROM "User";

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAccess_userId_projectId_key" ON "ProjectAccess"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "ProjectAccess" ADD CONSTRAINT "ProjectAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAccess" ADD CONSTRAINT "ProjectAccess_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteToken" ADD CONSTRAINT "InviteToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
