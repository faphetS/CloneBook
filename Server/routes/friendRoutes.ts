import express from "express";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  getFriendCount,
  getFriendRequests,
  getFriends,
  getFriendStatus,
  getPendingReqCount,
  sendFriendRequest,
  unfriendUser
} from "../controllers/friend.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/requests", authenticateToken, getFriendRequests);
router.get("/count/pending", authenticateToken, getPendingReqCount);
router.get("/count/:userId", getFriendCount);
router.get("/status/:userId", authenticateToken, getFriendStatus);
router.get("/", authenticateToken, getFriends);


router.post("/request", authenticateToken, sendFriendRequest);
router.post("/request/accept", authenticateToken, acceptFriendRequest);
router.post("/request/decline", authenticateToken, declineFriendRequest);
router.post("/request/cancel", authenticateToken, cancelFriendRequest);

router.delete("/:friendId", authenticateToken, unfriendUser)

export default router;