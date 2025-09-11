import { Router } from "express";
import { getUserInfo, searchUser, updateProfile } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/search", searchUser);
router.put("/profile", authenticateToken, upload.single("profilePic"), updateProfile);
router.get("/:userId", authenticateToken, getUserInfo);

export default router;