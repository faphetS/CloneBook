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
    if (!token) return res.sendStatus(401);

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        if (typeof decoded === "string") return res.sendStatus(403);

        req.user = decoded as JwtPayload;
        next();
      }
    );
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.sendStatus(500);
  }
};
