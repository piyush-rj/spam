import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({ message: "jwt-secret not found" });
        return;
    }

    if (!token) {
        res.status(500).json({ message: "token not found" });
        return;
    }

    try {
        jwt.verify(token, secret, (err) => {
            if(err) {
                res.status(401).json({ message: "You are not authorized" });
                return;
            }
            next();
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Authorization failed" });
        return;
    }
}