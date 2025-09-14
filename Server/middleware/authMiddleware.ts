import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwtPayload.types";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access token required" });

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        if (typeof decoded === "string") return res.status(403).json({ message: "Invalid token format" });

        req.user = decoded as JwtPayload;
        next();
      }
    );
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Authentication error" });
  }
};
