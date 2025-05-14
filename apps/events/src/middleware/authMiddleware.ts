import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";



export default function middleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ msg: "unauthorized: token missing or malformed" });
            return;
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET || "mysecret", (err, decodedUser) => {
            if (err) {
                res.status(401).json({
                    msg: "not authorized",
                    error: err
                });
                return;
            }

            req.user = decodedUser as AuthUser;
            next();
        });
    } catch (error) {
        res.status(401).json({
            message: "middleware error",
            error,
        });
        return;
    }
}
