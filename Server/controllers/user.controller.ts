import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { getDB } from "../config/db.js";
import { refreshTokenPayload } from "../types/jwtPayload.types.js";
import { LoginBody, SignupBody } from "../types/user.types.js";


export const signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {
  const { username, email, password } = req.body;
  const hashedPassword: string = await bcrypt.hash(password, 10);
  const value = [username, email, hashedPassword];
  const query: string = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  try {
    const db = getDB();
    const [result] = await db.execute(query, value);
    res.json({ success: true, id: (result as any).insertId });
  } catch (e: any) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }

};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";

  try {
    const db = getDB();
    const [rows] = await db.execute<RowDataPacket[]>(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Wrong Email" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ success: false, message: "Wrong Password" });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    await db.execute("INSERT INTO refresh_tokens (token, fk_u_id) VALUES (?, ?)", [
      refreshToken,
      user.id,
    ]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, accessToken });
  } catch (e: unknown) {
    console.error(e);
    const err = e instanceof Error ? e : new Error(String(e));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const query = "DELETE FROM refresh_tokens WHERE token = ?";
  if (!token) return res.sendStatus(204);

  try {
    const db = getDB();
    await db.execute(query, [token]);

    res.clearCookie(
      "refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const query = "SELECT * FROM refresh_tokens WHERE fk_u_id = ? AND token = ?";
  if (!token) return res.sendStatus(401);

  try {
    const db = getDB();
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as refreshTokenPayload;


    const [rows] = await db.execute<RowDataPacket[]>(query, [decoded.userId, token]);

    const tokenRecord = rows[0];
    if (!tokenRecord) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "30m" }
    );

    res.json({ accessToken });
  } catch (e: unknown) {
    console.error(e);
    const err = e instanceof Error ? e : new Error(String(e));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


