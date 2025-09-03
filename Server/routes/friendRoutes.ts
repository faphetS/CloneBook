import express from "express";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  getFriendCount,
  getFriendRequests,
  getFriends,
  getFriendStatus,
  sendFriendRequest
} from "../controllers/friend.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Requests
router.post("/request", authenticateToken, sendFriendRequest);
router.get("/requests", authenticateToken, getFriendRequests);
router.post("/request/accept", authenticateToken, acceptFriendRequest);
router.post("/request/decline", authenticateToken, declineFriendRequest);
router.post("/request/cancel", authenticateToken, cancelFriendRequest);

// Friends
router.get("/count/:userId", getFriendCount);
router.get("/status/:userId", authenticateToken, getFriendStatus);
router.get("/", authenticateToken, getFriends);

export default router;