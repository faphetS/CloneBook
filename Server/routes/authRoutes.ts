import express from "express";
import { login, logout, refreshToken, signup, verifyEmail } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;