/*
  Warnings:

  - Added the required column `projectId` to the `Task` table without a default value. This is not possible if the table is not empty.
*/

-- Step 1: Create new tables first
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Access" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Task" ADD COLUMN "dueDate" TIMESTAMP(3);
ALTER TABLE "Task" ADD COLUMN "projectId" INTEGER;

DO $$
DECLARE
    super_user_id INTEGER;
    unamed_project_id INTEGER;
BEGIN
    SELECT id INTO super_user_id FROM "User" WHERE "superUser" = true ORDER BY id ASC LIMIT 1;
    
    IF super_user_id IS NULL THEN
        SELECT id INTO super_user_id FROM "User" ORDER BY id ASC LIMIT 1;
    END IF;

    IF super_user_id IS NOT NULL THEN
        INSERT INTO "Project" (name, slug, "authorId", "createdAt", "updatedAt")
        VALUES ('Unamed', 'unamed', super_user_id, NOW(), NOW())
        RETURNING id INTO unamed_project_id;

        UPDATE "Task" SET "projectId" = unamed_project_id;

        INSERT INTO "Access" ("userId", "projectId", "createdAt")
        SELECT id, unamed_project_id, NOW() FROM "User";
    END IF;
END $$;

ALTER TABLE "Task" ALTER COLUMN "projectId" SET NOT NULL;

ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Access" ADD CONSTRAINT "Access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Access" ADD CONSTRAINT "Access_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;