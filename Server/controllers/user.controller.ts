import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { getDB } from "../config/db.js";
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
  } catch (e: unknown) {
    console.log(e);
    const err = e instanceof Error ? e : new Error(String(e));
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
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
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
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

