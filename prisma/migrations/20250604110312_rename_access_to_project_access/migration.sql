-- Rename the table instead of dropping it
ALTER TABLE "Access" RENAME TO "ProjectAccess";

-- Rename constraints to match new table name
ALTER TABLE "ProjectAccess" RENAME CONSTRAINT "Access_pkey" TO "ProjectAccess_pkey";
ALTER TABLE "ProjectAccess" RENAME CONSTRAINT "Access_projectId_fkey" TO "ProjectAccess_projectId_fkey";
ALTER TABLE "ProjectAccess" RENAME CONSTRAINT "Access_userId_fkey" TO "ProjectAccess_userId_fkey";