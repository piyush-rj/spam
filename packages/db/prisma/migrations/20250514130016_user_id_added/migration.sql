/*
  Warnings:

  - You are about to drop the column `name` on the `GroupUsers` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `GroupUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupUsers" DROP COLUMN "name",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupUsers" ADD CONSTRAINT "GroupUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
