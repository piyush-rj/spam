import prisma from "@repo/database";
import type { Request, Response } from "express";

export default async function deleteRoom(req: Request, res: Response) {
    const { roomId } = req.body;

    try {
        await prisma.room.delete({
            where: {
                id: roomId
            }
        })

        res.status(201).json({ message: "Room deleted successfully" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Room deletion failed" });
        return;
    }
}