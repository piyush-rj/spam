import prisma from "@repo/database";
import type { Request, Response } from "express";

export default async function createRoom(req: Request, res: Response) {
    const { userId, name, description, isPrivate, password, maxMembers } = req.body;

    try {
        console.log("inside room creation");
        const room = await prisma.room.create({
            data: {
                name,
                description,
                isPrivate,
                password,
                maxMembers,
                owner: {
                    connect: { id: userId }
                },
                members: {
                    create: {
                        user: {
                            connect: { id: userId }
                        },
                        role: "OWNER"
                    }
                }
            }
        })

        console.log("room ke andar");

        res.status(201).json({ success: true, room, message: "Room created successfully" });
        return;

    } catch (error) {
        res.status(500).json({ success: false, message: "Room creation failed" });
        return; 
    }
}