import { Request, Response } from "express";
import prisma from "@repo/db";
import { GroupType } from "@prisma/client"
import crypto from "crypto";

function generateInviteToken() {
  return crypto.randomBytes(16).toString("hex");
}

export default async function createChatGroup(req: Request, res: Response) {
  try {
    const { title, passcode, type = "PUBLIC" } = req.body;
    const user = req.user;
    const user_id = user?.id;

    if (!user_id) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    if (!title) {
      res.status(400).json({ message: "title is required" });
      return;
    }

    
    if (type === "PRIVATE" && !passcode) {
        res.status(400).json({ message: "passcode is required for private groups" });
        return;
    }

    const userExists = await prisma.user.findUnique({ where: { id: user_id } });
    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const existingGroup = await prisma.chatGroup.findFirst({
      where: {
        user_id,
        title,
      },
    });
    if (existingGroup) {
      res.status(409).json({ message: "You already have a group with this title" });
      return;
    }

    const invite_token = generateInviteToken();

    const group = await prisma.chatGroup.create({
      data: {
        title,
        passcode: type === "PRIVATE" ? passcode : null,
        type: type as GroupType,
        user_id,
        invite_token,
      },
    });

    await prisma.groupUsers.create({
      data: {
        group_id: group.id,
        user_id,
        role: "ADMIN",
      },
    });

    res.status(201).json({
      roomId: group.id,
      inviteLink: invite_token,
      group,
    });
  } catch (error) {
    console.error("create chat group error:", error);
    res.status(500).json({ message: "something went wrong" });
  }
}
