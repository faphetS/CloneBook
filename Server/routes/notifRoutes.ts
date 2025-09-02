import express from "express";
import { getNotif, markAllAsRead } from "../controllers/notif.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getNotif);
router.patch("/read-all", authenticateToken, markAllAsRead)


export default router;