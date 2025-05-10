import { Request, Response } from "express";
import prisma from "@repo/db";

export default async function updateGroup(req: Request, res: Response) {
    try {
        const { title, passcode } = req.body;
        const { id } = req.params;

        if (!title || !passcode) {
            res.status(400).json({ message: "enter the changes" });
            return;
        }

        const updatedGroup = await prisma.chatGroup.update({
            data: {
                title,
                passcode,
            },
            where: {
                id: id
            }
        });

        res.status(201).json({ message: "title and passcode updated successfully", updatedGroup});
        return;
    } catch (error) {
        console.error("update chat group error:", error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
}
