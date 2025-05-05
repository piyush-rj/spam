/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gamertag` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `playerRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoClip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "TeamGame" DROP CONSTRAINT "TeamGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "TeamGame" DROP CONSTRAINT "TeamGame_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvitation" DROP CONSTRAINT "TeamInvitation_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvitation" DROP CONSTRAINT "TeamInvitation_senderId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvitation" DROP CONSTRAINT "TeamInvitation_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_userId_fkey";

-- DropForeignKey
ALTER TABLE "VideoClip" DROP CONSTRAINT "VideoClip_gameId_fkey";

-- DropForeignKey
ALTER TABLE "VideoClip" DROP CONSTRAINT "VideoClip_userId_fkey";

-- DropForeignKey
ALTER TABLE "_GameToTeam" DROP CONSTRAINT "_GameToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToTeam" DROP CONSTRAINT "_GameToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "_GameToUser" DROP CONSTRAINT "_GameToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToUser" DROP CONSTRAINT "_GameToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "experienceLevel",
DROP COLUMN "gamertag",
DROP COLUMN "playerRole",
DROP COLUMN "region";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "Like";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamGame";

-- DropTable
DROP TABLE "TeamInvitation";

-- DropTable
DROP TABLE "TeamMember";

-- DropTable
DROP TABLE "UserGame";

-- DropTable
DROP TABLE "VideoClip";

-- DropTable
DROP TABLE "_GameToTeam";

-- DropTable
DROP TABLE "_GameToUser";

-- DropEnum
DROP TYPE "AuthType";

-- DropEnum
DROP TYPE "ExperienceLevel";

-- DropEnum
DROP TYPE "InvitationStatus";

-- DropEnum
DROP TYPE "PlayerRole";

-- DropEnum
DROP TYPE "Region";

-- DropEnum
DROP TYPE "TeamMemberRole";
