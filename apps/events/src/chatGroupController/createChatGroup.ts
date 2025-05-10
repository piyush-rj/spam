import { Request, Response } from "express";
import prisma from "@repo/db";

export default async function createChatGroup(req: Request, res: Response) {
    try {
        const { title, passcode } = req.body;
        const user = req.user;
        const user_id = user?.id;

        if (!user_id) {
            res.status(400).json({ message: "userId is required" });
            return
        }

        if (!title || !passcode) {
            res.status(400).json({ message: "title and passcode are required" });
            return;
        }

        const group = await prisma.chatGroup.create({
            data: {
                title,
                passcode,
                user_id,
            },
        });

        res.status(201).json(group);
        return;
    } catch (error) {
        console.error("create chat group error:", error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
}
