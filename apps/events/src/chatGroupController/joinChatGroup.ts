import prisma from "@repo/db";
import { Request, Response } from "express";

export async function joinGroup(req: Request, res: Response) {
  try {
    const { inviteToken, passcode } = req.body;
    const user = req.user;
    const user_id = user?.id;

    if (!user_id) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    if (!inviteToken) {
        res.status(400).json({ message: "inviteToken is required" });
      return;
    }

    const group = await prisma.chatGroup.findUnique({
      where: {
        invite_token: inviteToken,
      },
    });

    if (!group) {
        res.status(404).json({ message: "Group not found" });
      return;
    }

    if (group.type === "PRIVATE") {
      if (!passcode) {
          res.status(403).json({ message: "Invalid passcode" });
        return;
      }
    }

    const membership = await prisma.groupUsers.findFirst({
      where: {
        group_id: group.id,
        user_id,
      },
    });

    if (membership) {
        res.status(200).json({ message: "Already a member", group });
      return;
    }

    await prisma.groupUsers.create({
      data: {
        group_id: group.id,
        user_id,
        role: "MEMBER",
      },
    });

    res.status(200).json({ message: "Joined group successfully", group });
    return;
  } catch (error) {
    console.error("join group error:", error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
}
