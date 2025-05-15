import { Request, Response } from "express";
import prisma from "@repo/db";
import { GroupType } from "@prisma/client"

export default async function createChatGroup(req: Request, res: Response) {
    try {
        const { title, passcode, type = "PUBLIC" } = req.body;
        const user = req.user;
        const user_id = user?.id;

        console.log("Request body:", req.body);
        console.log("User object:", req.user);
        console.log("User ID:", user?.id);
        if (!user_id) {
            res.status(400).json({ message: "userId is required" });
            return
        }

        if (!title) {
            res.status(400).json({ message: "title is required" });
            return;
        }

        if (type == "PRIVATE" && !passcode ) {
            res.status(400).json({
                message: "passcode is required for private groups"
            })
            return;
        }

        const userExists = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!userExists) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const group = await prisma.chatGroup.create({
            data: {
                title,
                passcode: type === "PRIVATE" ? passcode : null,
                type: type as GroupType,
                user_id,
            },
        });

        await prisma.groupUsers.create({
            data: {
                group_id: group.id,
                user_id,
                role: 'ADMIN'
            }
        })

        res.status(201).json(group);
        return;
    } catch (error) {
        console.error("create chat group error:", error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
}
