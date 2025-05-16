/*
  Warnings:

  - A unique constraint covering the columns `[invite_token]` on the table `chat-groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invite_token` to the `chat-groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chat-groups" ADD COLUMN     "invite_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chat-groups_invite_token_key" ON "chat-groups"("invite_token");
