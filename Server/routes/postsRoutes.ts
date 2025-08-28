import { Router } from "express";
import { createPost, getComments, getPosts, postComment, toggleLike } from "../controllers/posts.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticateToken, getPosts);
router.post("/post", authenticateToken, createPost);
router.post("/post/:postId", authenticateToken, toggleLike);
router.get("/post/:postId/comments", authenticateToken, getComments);
router.post("/post/:postId/comments", authenticateToken, postComment);

export default router;