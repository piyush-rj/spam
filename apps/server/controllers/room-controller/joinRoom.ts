import prisma from "@repo/database";
import type { Request, Response } from "express";

export default async function(req: Request, res: Response) {
    const { userId, password } = req.body;
    const { roomId } = req.params;

    try {
        const existingRoom = await prisma.room.findUnique({
            where: {
                id: roomId
            }
        })

        if (!existingRoom) {
            res.status(404).json({ message: "Room not found" });
            return;
        }

        const roomPass = password;
        if (existingRoom.isPrivate && roomPass !== password ) {
            res.status(404).json({ message: "Invalid password" });
            return;
        }

        await prisma.roomMember.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                room: {
                    connect: { id: roomId }
                }
            }
        })

        res.status(201).json({ success: true, message: "Room joined successfully" });
        return;

    } catch (error) {
        res.status(500).json({ success: false, message: "Room join failed" });
        return;
    }
}