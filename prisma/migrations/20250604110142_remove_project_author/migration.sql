/*
  Warnings:

  - You are about to drop the column `authorId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_authorId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "authorId";
