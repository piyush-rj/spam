import prisma from "@repo/database";
import { Request, Response } from "express";

export default async function sendMessage(req: Request, res: Response) {
    const { roomId, content, userId } = req.body;

    if (!roomId || !content || !userId) {
        res.status(400).json({ message: "insufficient data" });
        return;
    }

    try {
        const message = await prisma.message.create({
            data: {
                content,
                author: {
                    connect : { id: userId }
                },
                room: {
                    connect: { id: roomId }
                }          
            },
            include: {
                author: true,
            }
        })

        res.status(201).json({ message, msg: "Sent message successfully" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Failed to send message" });
        return;
    }
}