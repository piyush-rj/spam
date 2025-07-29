import prisma from "@repo/database";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

export default async function joinRoom(req: Request, res: Response) {
    const { userId, roomId, password } = req.body;

    if (!userId || !roomId) {
        return res.status(400).json({ message: "User ID and Room ID are required" });
    }

    try {
        const existingRoom = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (!existingRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (existingRoom.isPrivate) {
            const isPasswordValid = await bcrypt.compare(password || "", existingRoom.password || "");
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }
        }

        const alreadyJoined = await prisma.roomMember.findFirst({
            where: {
                userId,
                roomId,
            },
        });

        if (alreadyJoined) {
            return res.status(200).json({ success: true, message: "Already a member of this room" });
        }

        await prisma.roomMember.create({
            data: {
                user: { connect: { id: userId } },
                room: { connect: { id: roomId } },
                role: "MEMBER",
            },
        });

        res.status(201).json({
            success: true,
            roomUrl: `/room/${roomId}`,
            message: "Room joined successfully",
        });
    } catch (error) {
        console.error("Join Room Error:", error);
        res.status(500).json({ success: false, message: "Room join failed" });
    }
}
