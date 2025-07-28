import prisma from "@repo/database";
import type { Request, Response } from "express";

export default async function getRoom(req: Request, res: Response) {
    const userId = req.query.userId as string;

    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    try {
        const ownedRooms = await prisma.room.findMany({
            where: { ownerId: userId },
            include: {
                owner: true,
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        const memberRooms = await prisma.roomMember.findMany({
            where: { userId: userId },
            include: {
                room: {
                    include: {
                        owner: true,
                        members: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        const joinedRooms = memberRooms
            .map((member) => member.room)
            .filter((room) => room.owner.id !== userId);

        res.status(200).json({ ownedRooms, joinedRooms, message: "listed rooms successfully" });
        return;

    } catch (error) {
        console.error("Failed to fetch user rooms:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}
