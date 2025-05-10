import { Router } from "express";
import createChatGroup from "../chatGroupController/createChatGroup";
import middleware from "../middleware/authMiddleware";
import index from "../chatGroupController/listGroupsController";
import show from "../chatGroupController/getGroupById";
import updateGroup from "../chatGroupController/updateChatGroup";
import deleteGroup from "../chatGroupController/deleteChatGroup";

const router = Router();

router.post("/group", middleware, createChatGroup);
router.put("/group/:id", middleware, updateGroup);
router.delete("/group/:id", middleware, deleteGroup);
router.get("/group", middleware, index);
router.get("/group/:id", middleware, show);

export default router;
