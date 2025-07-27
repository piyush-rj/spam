import { Router } from "express";
import signInController from "../controllers/user-controller/signInController";
import authMiddleware from "../middleware/authMiddleware";
import createRoom from "../controllers/room-controller/createRoom";
import joinRoom from "../controllers/room-controller/joinRoom";
import roomOwnerMiddleware from "../middleware/roomOwnerMiddleware";
import deleteRoom from "../controllers/room-controller/deleteRoom";
import leaveRoom from "../controllers/room-controller/leaveRoom";
import getRoom from "../controllers/room-controller/getRoom";

const router = Router();

router.post("/sign-in", signInController);



// room-controllers

router.post("/room/create-room", authMiddleware, createRoom);
router.post("/room/join-room/:id", authMiddleware, joinRoom);
router.delete("/room/delete-room/:id", authMiddleware, roomOwnerMiddleware, deleteRoom);
router.post("/room/leave-room/:id", authMiddleware, leaveRoom);
router.get("/rooms/list-rooms/:userId", authMiddleware, getRoom)


export default router;