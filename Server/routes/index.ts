import express from "express";
import authRoutes from "./authRoutes.js";
import friendRoutes from "./friendRoutes.js";
import notifRoutes from "./notifRoutes.js";
import postsRoutes from "./postsRoutes.js";
import protectedRoutes from "./protectedRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);
router.use("/content", postsRoutes);
router.use("/user", userRoutes);
router.use("/notifications", notifRoutes);
router.use("/friends", friendRoutes);

export default router;