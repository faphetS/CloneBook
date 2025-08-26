import { Request, Response } from "express";
import { getDB } from "../config/db.js";


export const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { content } = req.body;
    const userId: number = req.user.userId;
    const insertQuery = "INSERT INTO posts (fk_u_id, content) VALUES (?, ?)";
    const selectQuery = `
      SELECT posts.id, posts.content, posts.created_at, users.username 
      FROM posts 
      JOIN users ON posts.fk_u_id = users.id 
      WHERE posts.id = ?
    `;
    const db = getDB();

    if (!content) return res.status(400).json({ success: false, message: "Nothing to post." });
    const [result]: any = await db.execute(insertQuery, [userId, content]);
    const [rows]: any = await db.execute(selectQuery, [result.insertId]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getPosts = async (req: Request, res: Response) => {
  const query = `
    SELECT 
      posts.id, 
      posts.content, 
      posts.created_at, 
      users.username 
    FROM posts 
    JOIN users ON posts.fk_u_id = users.id 
    ORDER BY posts.created_at DESC
  `;
  try {
    const db = getDB();
    const [rows] = await db.execute(query);
    res.json(rows);
    console.log(rows);
  } catch (error: any) {
    console.log("Error fetching posts:", error.message || error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}