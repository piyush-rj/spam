import { Request, Response } from "express";
import prisma from "@repo/db";

export default async function show(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const group = await prisma.chatGroup.findUnique({
            where: {
                id: id
            }
        });

        res.status(201).json(group);
        return;
    } catch (error) {
        console.error("fetch chat group by id error:", error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
}
