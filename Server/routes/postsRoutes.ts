import { Router } from "express";
import { createPost, deleteComment, deletePost, getComments, getPosts, getUserPosts, postComment, toggleCommentLike, toggleLike } from "../controllers/posts.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticateToken, getPosts);
router.get("/:userId", authenticateToken, getUserPosts);
router.get("/post/:postId/comments", authenticateToken, getComments);

router.post("/post", authenticateToken, createPost);
router.post("/post/:postId", authenticateToken, toggleLike);
router.post("/post/:postId/comments", authenticateToken, postComment);
router.post("/comment/:commentId/like", authenticateToken, toggleCommentLike);

router.delete("/post/:postId", authenticateToken, deletePost);
router.delete("/comment/:commentId", authenticateToken, deleteComment)

export default router;