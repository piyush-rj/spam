-- CreateTable
CREATE TABLE "chat-groups" (
    "id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(191) NOT NULL,
    "passcode" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat-groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupUsers" (
    "id" SERIAL NOT NULL,
    "group_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat-groups_createdAt_idx" ON "chat-groups"("createdAt");

-- AddForeignKey
ALTER TABLE "chat-groups" ADD CONSTRAINT "chat-groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUsers" ADD CONSTRAINT "GroupUsers_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "chat-groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
