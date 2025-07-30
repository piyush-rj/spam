import prisma from "@repo/database";
import { Request, Response } from "express";

export default async function getMessages(req: Request, res: Response) {
    const { roomId } = req.query;

    if (!roomId || typeof roomId !== "string") {
        res.status(400).json({ message: "Insufficient or invalid roomId" });
        return;
    }

    try {
        const messages = await prisma.message.findMany({
            where: { roomId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        res.status(200).json({ messages, msg: "Fetched messages successfully" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" });
        return;
    }
}
