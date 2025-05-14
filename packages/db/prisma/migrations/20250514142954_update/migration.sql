/*
  Warnings:

  - You are about to drop the column `creator_id` on the `GroupUsers` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `chat-groups` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `GroupUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `chat-groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupUsers" DROP CONSTRAINT "GroupUsers_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "chat-groups" DROP CONSTRAINT "chat-groups_creator_id_fkey";

-- AlterTable
ALTER TABLE "GroupUsers" DROP COLUMN "creator_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "chat-groups" DROP COLUMN "creator_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "chat-groups" ADD CONSTRAINT "chat-groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUsers" ADD CONSTRAINT "GroupUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
