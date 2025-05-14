// src/routes/index.ts
import { Router } from "express";
import createChatGroup from "../chatGroupController/createChatGroup";
import middleware from "../middleware/authMiddleware";
import index from "../chatGroupController/listGroupsController";
import updateGroup from "../chatGroupController/updateChatGroup";
import deleteGroup from "../chatGroupController/deleteChatGroup";
import userGroups from "../userController/groupByUserId";
import show from "../chatGroupController/getGroupById";

const router = Router();

router.post("/group", middleware, createChatGroup);
router.put("/group/:id", middleware, updateGroup);
router.delete("/group/:id", middleware, deleteGroup);
router.get("/group", middleware, index);
router.get("/group/:id", middleware, show);

router.get("/user/:userId/groups", middleware, userGroups);

export default router;