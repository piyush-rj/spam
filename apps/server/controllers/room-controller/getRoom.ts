import prisma from "@repo/database";
import type { Request, Response } from "express";

export default async function getRoom(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    try {
        const ownedRooms = await prisma.room.findMany({
            where: { ownerId: String(userId) },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        const memberRooms = await prisma.roomMember.findMany({
            where: { userId: String(userId) },
            include: {
                room: {
                    include: {
                        members: {
                            include: {
                                user: true,
                            },
                        },
                        owner: true,
                    },
                },
            },
        });

        const joinedRooms = memberRooms.map((member) => member.room);

        res.status(200).json({
            ownedRooms,
            joinedRooms,
        });
        return;
    } catch (error) {
        console.error("Failed to fetch user rooms:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}
