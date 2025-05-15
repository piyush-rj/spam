import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function userGroups (req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const userIdNum = parseInt(userId);

    const groups = await prisma.chatGroup.findMany({
      where: {
        user_id: userIdNum
      },
      include: {
        _count: {
          select: { GroupUsers: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.json(groups);
    return;
  } catch (error) {
    res.status(500).json({ message: "userGroups fetch failed", error });
    return;
  }
}