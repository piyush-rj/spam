import prisma from "@repo/database";
import { Request, Response } from "express";

export default async function getUsername(req: Request, res: Response) {
    const { userId } = req.query;

    if (!userId) {
        res.status(400).json({ message: "Missing or invalid userId" });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: String(userId) },
            select: { username: true },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ username: user.username, message: "username fetch successfull" });
        return;
    } catch (error) {
        console.error("Error fetching username:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}
