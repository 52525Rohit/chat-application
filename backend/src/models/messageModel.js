import pool from "../config/database.js";

class Message {
  static async create({ senderId, receiverId, messageContent, imagesUrl }) {
    const [result] = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message_content, images_url) VALUES (?, ?, ?, ?)",
      [senderId, receiverId, messageContent || null, imagesUrl || null],
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async findConversation(userId1, userId2) {
    const [rows] = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
       ORDER BY timestamp ASC`,
      [userId1, userId2, userId2, userId1],
    );
    return rows;
  }

  static toResponse(row) {
    if (!row) return null;
    return {
      message_id: row.id,
      sender_id: row.sender_id,
      receiver_id: row.receiver_id,
      message_content: row.message_content,
      images_url: row.images_url,
      timestamp: row.timestamp,
    };
  }
}

export default Message;
