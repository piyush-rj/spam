import { Router } from "express";
import signInController from "../controllers/user-controller/signInController";
import authMiddleware from "../middleware/authMiddleware";
import createRoom from "../controllers/room-controller/createRoom";
import joinRoom from "../controllers/room-controller/joinRoom";
import roomOwnerMiddleware from "../middleware/roomOwnerMiddleware";
import deleteRoom from "../controllers/room-controller/deleteRoom";
import leaveRoom from "../controllers/room-controller/leaveRoom";
import getRoom from "../controllers/room-controller/getRoom";
import createUsername from "../controllers/user-controller/createUsername";
import getUsername from "../controllers/user-controller/getUsername";

const router = Router();


// user-controllers
router.post("/sign-in", signInController);
router.post('/update-username', authMiddleware, createUsername);
router.get('/get-username', authMiddleware, getUsername);



// room-controllers
router.post("/room/create-room", authMiddleware, createRoom);
router.post("/room/join-room/:id", authMiddleware, joinRoom);
router.delete("/room/delete-room/:id", authMiddleware, roomOwnerMiddleware, deleteRoom);
router.post("/room/leave-room/:id", authMiddleware, leaveRoom);
router.get("/rooms/list-rooms/:id", authMiddleware, getRoom)




export default router;