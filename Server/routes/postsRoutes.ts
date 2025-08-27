import { Router } from "express";
import { createPost, getPosts, toggleLike } from "../controllers/posts.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticateToken, getPosts);
router.post("/post", authenticateToken, createPost);
router.post("/post/:postId", authenticateToken, toggleLike);

export default router;