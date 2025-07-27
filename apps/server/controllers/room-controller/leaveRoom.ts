import prisma from "@repo/database";
import type { Request, Response } from "express";

export default async function leaveRoom(req: Request, res: Response) {
    const { userId } = req.body;
    const { roomId } = req.params;

    try {
        await prisma.roomMember.delete({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: String(roomId),
                }
            }
        })

        res.status(201).json({ message: "Room left successfully" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Room leave failed" });
        return;
    }
}