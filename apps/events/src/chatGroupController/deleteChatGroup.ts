import { Request, Response } from "express";
import prisma from "@repo/db";

export default async function deleteGroup(req: Request, res: Response) {
    console.log("inside delete")
    try {
        const { id } = req.params;

        await prisma.chatGroup.delete({
            where: {
                id: id
            }
        });
        console.log("inside delete 2")


        res.status(201).json({ message: "group deleted successfully" });
        console.log("done scene delete")

        return;
    } catch (error) {
        console.error("delete chat group error:", error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
}
