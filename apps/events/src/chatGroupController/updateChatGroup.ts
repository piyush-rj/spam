import { Request, Response } from "express";
import prisma from "@repo/db";
import { GroupType } from "@prisma/client";

export default async function updateGroup(req: Request, res: Response) {
    try {
        const { title, passcode, type } = req.body;
        const { id } = req.params;
        const user = req.user;
        const user_id = user?.id;

        console.log("Update group - Request body:", req.body);
        console.log("Update group - User object:", req.user);
        console.log("Update group - Group ID:", id);

        if (!user_id) {
            res.status(400).json({ message: "Authentication required" });
            return;
        }

        if (!title) {
            res.status(400).json({ message: "Title is required" });
            return;
        }

        const existingGroup = await prisma.chatGroup.findUnique({
            where: { id },
            include: {
                GroupUsers: {
                    where: {
                        user_id,
                        role: 'ADMIN'
                    }
                }
            }
        });

        if (!existingGroup) {
            res.status(404).json({ message: "Group not found" });
            return;
        }

        if (existingGroup.GroupUsers.length === 0) {
            res.status(403).json({ message: "Only group admins can update group settings" });
            return;
        }

        const groupType = type || existingGroup.type;

        if (groupType === "PRIVATE" && !passcode && !existingGroup.passcode) {
            res.status(400).json({
                message: "Passcode is required for private groups"
            });
            return;
        }

        const updateData: any = { title };

        if (groupType === "PRIVATE") {
            if (passcode) {
                updateData.passcode = passcode;
            }
        } else {
            updateData.passcode = null;
        }

        if (type && type !== existingGroup.type) {
            updateData.type = type as GroupType;
        }

        const updatedGroup = await prisma.chatGroup.update({
            data: updateData,
            where: { id }
        });

        res.status(200).json({ 
            message: "Group updated successfully", 
            updatedGroup
        });
        return;
    } catch (error) {
        console.error("Update chat group error:", error);
        res.status(500).json({ message: "Something went wrong" });
        return;
    }
}