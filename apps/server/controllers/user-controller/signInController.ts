import type { Request, Response } from "express";
import prisma from "@repo/database"
import jwt from "jsonwebtoken"


export default async function signInController(req: Request, res: Response) {
    const { user } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })

        let myUser;
        if (existingUser) {
            myUser = await prisma.user.update({
                where: {
                    email: user.email
                },
                data: {
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            })
        } else {
            myUser = await prisma.user.create({
                data: {
                    email: user.email,
                    name: user.name,
                    image: user.image
                }
            })
        }

        console.log("user is: ", myUser);

        const jwtPayload = {
            name: myUser.name,
            email: myUser.email,
            id: myUser.id
        };

        const secret = process.env.JWT_SECRET;
        if(!secret) {
            res.status(300).json({ message: "Internal server error" });
            return;
        }

        const token = jwt.sign(jwtPayload, secret);
        res.json({
            success: true,
            user: myUser,
            token: token
        });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Sign-In failed"
        });
        return;
    }
}