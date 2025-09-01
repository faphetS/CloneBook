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
      SELECT 
        posts.id, 
        posts.content, 
        posts.created_at, 
        users.id AS userId,
        users.username,
        users.profile_pic AS profilePic
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
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query = `
  SELECT 
    posts.id, 
    posts.content, 
    posts.created_at,
    users.id AS userId, 
    users.username, 
    users.profile_pic AS profilePic,
    COUNT(likes.id) AS likeCount,
    CASE WHEN SUM(CASE WHEN likes.fk_u_id = ? THEN 1 ELSE 0 END) > 0 THEN 1 ELSE 0 END AS isLiked,
    (SELECT COUNT(*) FROM comments c WHERE c.fk_p_id = posts.id) AS commentCount
  FROM posts 
  JOIN users ON posts.fk_u_id = users.id
  LEFT JOIN likes ON posts.id = likes.fk_p_id
  GROUP BY posts.id, posts.content, posts.created_at, users.id, users.username 
  ORDER BY posts.created_at DESC
`;
  try {
    const db = getDB();
    const [rows] = await db.execute(query, [req.user.userId]);
    res.json(rows);
  } catch (error: any) {
    console.log("Error fetching posts:", error.message || error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}

export const getUserPosts = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query = `
    SELECT 
      posts.id, 
      posts.content, 
      posts.created_at, 
      users.id AS userId,
      users.username, 
      users.profile_pic AS profilePic,
      COUNT(likes.id) AS likeCount,
      CASE WHEN SUM(CASE WHEN likes.fk_u_id = ? THEN 1 ELSE 0 END) > 0 THEN 1 ELSE 0 END AS isLiked,
      (SELECT COUNT(*) FROM comments c WHERE c.fk_p_id = posts.id) AS commentCount
    FROM posts 
    JOIN users ON posts.fk_u_id = users.id
    LEFT JOIN likes ON posts.id = likes.fk_p_id
    WHERE users.id = ?
    GROUP BY posts.id, posts.content, posts.created_at, users.id, users.username 
    ORDER BY posts.created_at DESC
  `;
  try {
    const db = getDB();
    const [rows] = await db.execute(query, [req.user.userId, userId]);
    res.json(rows);
  } catch (error: any) {
    console.log("Error fetching posts:", error.message || error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}

export const toggleLike = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId: number = req.user.userId;
    const postId: number = parseInt(req.params.postId);
    const checkLikeQuery = "SELECT id FROM likes WHERE fk_p_id = ? AND fk_u_id = ?";
    const unlikeQuery = "DELETE FROM likes WHERE fk_p_id = ? AND fk_u_id = ?";
    const likeQuery = "INSERT INTO likes (fk_p_id, fk_u_id) VALUES (?, ?)";

    const db = getDB();

    const [existing]: any = await db.execute(
      checkLikeQuery,
      [postId, userId]
    );
    if (existing.length > 0) {
      // unlike
      await db.execute(unlikeQuery, [postId, userId]);
      return res.json({ liked: false });
    }

    //like
    await db.execute(likeQuery, [postId, userId]);
    res.json({ liked: true });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const toggleCommentLike = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const userId = req.user.userId;
  const commentId = parseInt(req.params.commentId);
  const checkQuery = "SELECT id FROM comment_likes WHERE fk_c_id = ? AND fk_u_id = ?";
  const likeQuery = "INSERT INTO comment_likes (fk_c_id, fk_u_id) VALUES (?, ?)";
  const unlikeQuery = "DELETE FROM comment_likes WHERE fk_c_id = ? AND fk_u_id = ?";

  try {
    const db = getDB();
    const [existing]: any = await db.execute(checkQuery, [commentId, userId]);

    if (existing.length > 0) {
      await db.execute(unlikeQuery, [commentId, userId]);
      return res.json({ liked: false });
    }

    await db.execute(likeQuery, [commentId, userId]);
    res.json({ liked: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const postId: number = parseInt(req.params.postId);
  const query = `
SELECT 
  c.id, 
  c.content, 
  c.created_at, 
  c.fk_u_id AS userId,
   c.fk_p_id AS postId,
  u.username,
  u.profile_pic AS profilePic,
  COUNT(cl.id) AS likeCount,
  CASE WHEN SUM(CASE WHEN cl.fk_u_id = ? THEN 1 ELSE 0 END) > 0 THEN 1 ELSE 0 END AS isLiked
FROM comments c
JOIN users u ON u.id = c.fk_u_id
LEFT JOIN comment_likes cl ON c.id = cl.fk_c_id
WHERE c.fk_p_id = ?
GROUP BY c.id, c.content, c.created_at, u.username, c.fk_u_id
ORDER BY c.created_at ASC
`;

  try {
    const db = getDB();
    const [result]: any = await db.execute(query, [req.user.userId, postId]);
    res.json(result)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

export const postComment = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Comment required" });

  const userId: number = req.user.userId;
  const postId: number = parseInt(req.params.postId);

  const insertQuery = `INSERT INTO comments (fk_p_id, fk_u_id, content) VALUES (?, ?, ?)`;
  const selectQuery = `
    SELECT 
      c.id, 
      c.content, 
      c.created_at, 
      c.fk_u_id AS userId, 
      u.profile_pic AS profilePic,
      u.username
    FROM comments c
    JOIN users u ON u.id = c.fk_u_id
    WHERE c.id = ?
    ORDER BY c.created_at ASC
  `;

  try {
    const db = getDB();
    const [result]: any = await db.execute(insertQuery, [postId, userId, content]);
    const [rows]: any = await db.execute(selectQuery, [result.insertId]);

    res.status(201).json({
      id: rows[0].id,
      postId,
      userId: rows[0].userId,
      username: rows[0].username,
      profilePic: rows[0].profilePic,
      content: rows[0].content,
      created_at: rows[0].created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};
