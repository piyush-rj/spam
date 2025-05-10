import { Request, Response } from "express";
import prisma from "@repo/db";

export default async function index(req: Request, res: Response) {
    try {
        const user = req.user;
        const user_id = user?.id;

        if (!user_id) {
            res.status(400).json({ message: "userId is required" });
            return
        }

        const groups = await prisma.chatGroup.findMany({
            where: {
                user_id: user_id
            },
            orderBy: { createdAt: "desc" }
        });

        res.status(201).json(groups);
        return;
    } catch (error) {
        console.error("fetch chat group error:", error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
}
