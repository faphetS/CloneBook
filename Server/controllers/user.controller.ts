import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import path from "path";
import { fileURLToPath } from "url";
import { getDB } from "../config/db.js";
import { refreshTokenPayload } from "../types/jwtPayload.types.js";
import { LoginBody, SignupBody } from "../types/user.types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

    res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profile_pic,
        created_at: user.created_at
      }
    });

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

export const getUserInfo = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const query = `SELECT 
    users.id,
    users.username,
    users.email,
    users.created_at AS createdAt,
    users.profile_pic AS profilePic,
    users.role
    FROM users
    WHERE users.id = ?
    `
  try {
    const db = getDB();
    const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);
    res.json(rows[0]);
  } catch (error: any) {
    console.log("Error fetching user data:", error.message || error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { username, password } = req.body;
  const newProfilePic = req.file ? req.file.filename : undefined;
  const fields: string[] = [];
  const values: any[] = [];
  console.log("Body:", req.body);
  console.log("File:", req.file);

  try {
    const db = getDB();
    if (newProfilePic) {
      const [rows] = await db.execute("SELECT profile_pic AS profilePic FROM users WHERE id = ?", [req.user.userId]);
      const currentPic = (rows as any)[0]?.profilePic;

      if (currentPic) {
        const filePath = path.join(__dirname, "../../uploads", currentPic)
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.log("Failed to delete old profile pic:", err);
        }
      }

      fields.push("profile_pic = ?");
      values.push(newProfilePic);
    }
    if (username) {
      if (username.trim().length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }
      fields.push("username = ?");
      values.push(username.trim());
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }
    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(req.user.userId);

    await db.execute(query, values);

    res.json({ message: "Profile updated successfully" });
  } catch (error: any) {
    console.error(error);
    if (error instanceof Error && error.message.includes("File too large")) {
      return res.status(400).json({ message: "Profile picture must be under 1MB" });
    } else if (error instanceof Error && error.message.includes("Only images are allowed")) {
      return res.status(400).json({ message: "Invalid file type. Only images allowed" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

