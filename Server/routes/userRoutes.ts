import { Router } from "express";
import { getUserInfo, updateProfile } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/:userId", authenticateToken, getUserInfo);
router.put("/profile", authenticateToken, upload.single("profilePic"), updateProfile);

export default router;