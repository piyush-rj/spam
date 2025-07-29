import prisma from "@repo/database";
import type { NextFunction, Request, Response } from "express";

export default async function roomOwnerMiddleware(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.headers;
    const { roomId } = req.headers;

    try {
        if (!userId) {
            res.status(401).json({ message: "Authentication failed" });
            return;
        }

        const room = await prisma.room.findUnique({
            where: {
                id: String(roomId)
            }
        })

        if (!room) {
            res.status(404).json({ message: "Room not found" });
            return;
        }

        if (room.ownerId !== userId) {
            res.status(403).json({ message: "You are not the owner" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "unauthorized" });
        return;
    }
}