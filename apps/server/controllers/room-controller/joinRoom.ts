import prisma from "@repo/database";
import type { Request, Response } from "express";

export default async function (req: Request, res: Response) {
    const { userId, roomId, password } = req.body;

    if (!userId || !roomId) {
        res.status(400).json({ message: "User ID and Room ID are required" });
        return;
    }

    try {
        const existingRoom = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if (!existingRoom) {
            res.status(404).json({ message: "Room not found" });
            return;
        }

        if (existingRoom.isPrivate && existingRoom.password !== password) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        await prisma.roomMember.create({
            data: {
                user: { connect: { id: userId } },
                room: { connect: { id: roomId } }
            }
        });

        res.status(201).json({ success: true, message: "Room joined successfully" });
        return;

    } catch (error) {
        console.error("Join Room Error:", error);
        res.status(500).json({ success: false, message: "Room join failed" });
        return;
    }
}
