import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { getDB } from "../config/db.js";

//helper
export const createNotification = async (
  userId: number,
  senderId: number,
  type: string,
  text: string
) => {
  const query = `INSERT INTO notifications (user_id, sender_id, type, text, unread) 
                 VALUES (?, ?, ?, ?, 1)`;
  const db = getDB();
  await db.execute(query, [userId, senderId, type, text]);
};

export const getNotif = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const limit = Math.min(Number(req.query.limit) || 10, 10);
  const offset = Number(req.query.offset) || 0;
  const query = `
      SELECT 
        n.id, 
        n.type, 
        n.text, 
        n.unread, 
        n.created_at AS createdAt, 
        n.sender_id AS senderId,
        u.username AS senderName,
        u.profile_pic AS profilePic,
        u.profile_pic_type AS picType
      FROM notifications n
      JOIN users u ON n.sender_id = u.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
    `;

  try {
    const db = getDB();
    const [rows]: any = await db.query<RowDataPacket[]>(query, [req.user.userId, limit, offset]);

    const notifications = rows.map((notif: any) => {
      let profilePicBase64: string | null = null;
      if (notif.profilePic) {
        profilePicBase64 = `data:${notif.picType};base64,${Buffer.from(notif.profilePic).toString('base64')}`;
      }
      return {
        ...notif,
        profilePic: profilePicBase64,
      };
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND unread = 1";

  try {
    const db = getDB();
    const [rows]: any = await db.query(query, [req.user.userId]);
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query = "UPDATE notifications SET unread = 0 WHERE user_id = ?";

  try {
    const db = getDB();
    await db.query(query, [req.user.userId]);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};




