import prisma from "@repo/database";
import { Request, Response } from "express";

export default async function createUsername(req: Request, res: Response) {
    const { userId, username } = req.body;

    if (!userId || !username) {
        return res.status(400).json({ message: "Missing userId or username" });
    }

    try {
        const existing = await prisma.user.findUnique({
            where: { username },
        });

        if (existing) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { username },
        });

        return res.status(200).json({
            updatedUsername: updatedUser.username,
            message: "Username updated successfully",
        });
    } catch (error) {
        console.error("Username update failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
