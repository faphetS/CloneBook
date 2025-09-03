import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { getDB } from "../config/db.js";


export const sendFriendRequest = async (req: Request, res: Response) => {
  const { receiver_id } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const checkQuery = "SELECT * FROM friend_requests WHERE sender_id=? AND receiver_id=?";
  const insertQuery = "INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)";

  if (req.user.userId === receiver_id) {
    return res.status(400).json({ message: "You can't send a request to yourself" });
  }

  try {
    const db = getDB();
    const [existing] = await db.execute<RowDataPacket[]>(checkQuery, [
      req.user.userId,
      receiver_id
    ]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "Request already sent" });
    }
    await db.query(insertQuery, [
      req.user.userId,
      receiver_id
    ]);

    res.status(201).json({ message: "Friend request sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send friend request" });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  const { sender_id } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const deleteQuery = "DELETE FROM friend_requests WHERE sender_id=? AND receiver_id=?";
  const insertQuery = "INSERT IGNORE INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)";

  try {
    const db = getDB();
    await db.execute(deleteQuery, [
      sender_id,
      req.user.userId
    ]);
    await db.execute(insertQuery, [
      sender_id,
      req.user.userId,
      req.user.userId,
      sender_id
    ]);

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
};

export const declineFriendRequest = async (req: Request, res: Response) => {
  const { sender_id } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query = "DELETE FROM friend_requests WHERE sender_id=? AND receiver_id=?";

  try {
    const db = getDB();
    await db.execute(query, [
      sender_id,
      req.user.userId
    ]);

    res.json({ message: "Friend request declined" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to decline friend request" });
  }
};

export const cancelFriendRequest = async (req: Request, res: Response) => {
  const { receiver_id } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query = "DELETE FROM friend_requests WHERE sender_id=? AND receiver_id=?";

  try {
    const db = getDB();
    await db.execute(query, [
      req.user.userId,
      receiver_id
    ]);

    res.json({ message: "Friend request declined" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel friend request" });
  }
};

export const getFriendRequests = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query = `
    SELECT 
      fr.id,
      fr.sender_id AS senderId,
      u.username AS senderName,
      u.profile_pic AS senderProfilePic,
      fr.created_at AS createdAt
    FROM friend_requests fr
    JOIN users u ON fr.sender_id = u.id
    WHERE fr.receiver_id = ?
    ORDER BY fr.created_at DESC
  `;

  try {
    const db = getDB();
    const [rows] = await db.execute<RowDataPacket[]>(query, [req.user.userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query = `SELECT 
  u.id, 
  u.username, 
  u.profile_pic AS profilePic
  FROM friends f
  JOIN users u ON f.friend_id = u.id
  WHERE f.user_id = ?`;

  try {
    const db = getDB();
    const [rows] = await db.execute<RowDataPacket[]>(
      query,
      [req.user.userId]
    );


    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

export const getFriendCount = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }
  try {
    const db = getDB();
    const [countResult] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalFriends FROM friends WHERE user_id = ?`,
      [userId]
    );

    res.json({ friendCount: countResult[0].totalFriends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch friend count" });
  }
};

export const getFriendStatus = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.userId;
  const targetId = Number(req.params.userId);
  if (isNaN(targetId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }
  if (userId === targetId) {
    return res.json({ status: "self" });
  }

  try {
    const db = getDB();

    const [friends] = await db.execute<RowDataPacket[]>(
      "SELECT 1 FROM friends WHERE user_id=? AND friend_id=?",
      [userId, targetId]
    );
    if (friends.length > 0) {
      return res.json({ status: "friends" });
    }

    // they sent me a request
    const [incoming] = await db.execute<RowDataPacket[]>(
      "SELECT 1 FROM friend_requests WHERE sender_id=? AND receiver_id=?",
      [targetId, userId]
    );
    if (incoming.length > 0) {
      return res.json({ status: "pending_incoming" });
    }

    // I sent them a request
    const [outgoing] = await db.execute<RowDataPacket[]>(
      "SELECT 1 FROM friend_requests WHERE sender_id=? AND receiver_id=?",
      [userId, targetId]
    );
    if (outgoing.length > 0) {
      return res.json({ status: "pending_outgoing" });
    }

    // No relationship
    res.json({ status: "none" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check friend status" });
  }
};







