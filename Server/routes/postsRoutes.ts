import { Router } from "express";
import { createPost, getPosts } from "../controllers/posts.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getPosts);
router.post("/post", authenticateToken, createPost);

export default router;