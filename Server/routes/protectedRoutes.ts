import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/sample", authenticateToken, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user,
  });
});

export default router;
