/*
  Warnings:

  - Added the required column `type` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "GroupUsers" ADD COLUMN     "role" "GroupRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "chat-groups" ALTER COLUMN "passcode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "type" "GroupType" NOT NULL;

-- CreateTable
CREATE TABLE "UserPresence" (
    "userId" INTEGER NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPresence_pkey" PRIMARY KEY ("userId")
);
