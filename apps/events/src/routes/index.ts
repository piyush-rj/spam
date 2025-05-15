// src/routes/index.ts
import { Router } from "express";
import createChatGroup from "../chatGroupController/createChatGroup";
import middleware from "../middleware/authMiddleware";
import index from "../chatGroupController/listGroupsController";
import updateGroup from "../chatGroupController/updateChatGroup";
import deleteGroup from "../chatGroupController/deleteChatGroup";
import show from "../chatGroupController/getGroupById";
import userGroups from "../userController/groupByUserId";
import { uploadImage } from "../chatGroupController/uploadGroupImage";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

// group-routes
router.post("/group", middleware, createChatGroup);
router.put("/group/:id", middleware, updateGroup);
router.delete("/group/:id", middleware, deleteGroup);
router.get("/group", middleware, index);
router.get("/group/:id", middleware, show);

// image-upload
router.post("/upload", middleware, upload.single("image"), uploadImage)


// user-routes
router.get("/my-groups/:userId", middleware, userGroups);

export default router;