import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import path from "path";
import { fileURLToPath } from "url";
import { getDB } from "../config/db.js";
import { refreshTokenPayload } from "../types/jwtPayload.types.js";
import { LoginBody, SignupBody } from "../types/user.types.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {
  const { username, email, password } = req.body;
  const hashedPassword: string = await bcrypt.hash(password, 10);

  const query = "INSERT INTO users (username, email, password, isVerified) VALUES (?, ?, ?, ?)";
  const query2 = "INSERT INTO verification_tokens (userId, token, expiresAt) VALUES (?, ?, ?)";

  let db;
  let userId: number | null = null;

  try {
    db = await getDB().getConnection();

    const [result] = await db.query(query, [username, email, hashedPassword, false]);

    userId = (result as any).insertId;
    console.log("✅ User inserted successfully with ID:", userId);
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const mysqlExpiresAt = expiresAt.toISOString().slice(0, 19).replace("T", " ");

    console.log("📝 Attempting to insert verification token:", {
      userId,
      token,
      expiresAt: mysqlExpiresAt
    });

    const [tokenResult] = await db.query(query2, [userId, token, mysqlExpiresAt]);
    console.log("✅ Verification token inserted:", tokenResult);

    try {
      await sendVerificationEmail(email, token);
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    res.json({
      success: true,
      message: "Signup successful. Please verify your email.",
    });
  } catch (e: any) {
    console.error("Signup error:", e);

    if (userId && db) {
      try {
        await db.query("DELETE FROM users WHERE id = ?", [userId]);
        console.log("🗑️ Rolled back user insertion due to error");
      } catch (deleteError) {
        console.error("❌ Failed to delete user during rollback:", deleteError);
      }
    }


    if (e.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  } finally {
    if (db) {
      db.release();
      console.log("🔗 Connection released back to pool");
    }
  }

};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ success: false, message: "Valid token is required" });
  }
  let db;

  try {
    db = await getDB().getConnection();

    const [tokenRows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM verification_tokens WHERE token = ?",
      [token]
    );

    if (tokenRows.length > 0) {
      const tokenRecord = tokenRows[0];
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      if (tokenRecord.expiresAt < now) {
        await db.query("DELETE FROM users WHERE id = ?", [tokenRecord.userId]);
        await db.query("DELETE FROM verification_tokens WHERE id = ?", [tokenRecord.id]);
        return res.status(400).json({ success: false, message: "Verification link has expired." });
      }

      await db.query("UPDATE users SET isVerified = true WHERE id = ?", [tokenRecord.userId]);
      await db.query("DELETE FROM verification_tokens WHERE id = ?", [tokenRecord.id]);

      return res.json({ success: true, message: "Email verified successfully" });
    }

    return res.json({ success: true, message: "Email verified successfully" });

  } catch (error: any) {
    console.error("Verification error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    if (db) db.release();
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

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
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

    await db.execute("DELETE FROM refresh_tokens WHERE fk_u_id = ?", [user.id]);
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

    const [updatedRows] = await db.execute(
      "SELECT id, username, profile_pic AS profilePic, created_at FROM users WHERE id = ?",
      [req.user.userId]
    );
    const updatedUser = (updatedRows as any)[0];

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });


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

export const searchUser = async (req: Request, res: Response) => {
  let { username } = req.query;
  const query = "SELECT id, username, profile_pic AS profilePic FROM users WHERE username LIKE ? LIMIT 10";

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "username query required" });
  }
  username = username.trim();

  try {
    const db = getDB();
    const [rows] = await db.query(query, [`%${username}%`]);
    res.json(rows);
  } catch (error) {
    console.error("Search error: ", error);
    res.status(500).json({ message: "Server error" });
  }
}

