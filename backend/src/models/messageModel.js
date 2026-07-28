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

  static async findConversationPage(userId1, userId2, { limit = 30, beforeId } = {}) {
    const params = [userId1, userId2, userId2, userId1];
    let cursorClause = "";
    if (beforeId) {
      cursorClause = "AND id < ?";
      params.push(beforeId);
    }
    params.push(limit);

    const [rows] = await pool.query(
      `SELECT * FROM messages
       WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) ${cursorClause}
       ORDER BY id DESC
       LIMIT ?`,
      params,
    );
    return rows.reverse();
  }

  static async markConversationRead(readerId, otherUserId) {
    const [result] = await pool.query(
      "UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ? AND is_read = 0",
      [readerId, otherUserId],
    );
    return result.affectedRows;
  }

  static async editMessage(id, senderId, messageContent) {
    const [result] = await pool.query(
      "UPDATE messages SET message_content = ?, is_edited = 1 WHERE id = ? AND sender_id = ? AND is_deleted = 0",
      [messageContent, id, senderId],
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  static async softDeleteMessage(id, senderId) {
    const existing = await this.findById(id);
    if (!existing || existing.sender_id !== senderId) return null;

    await pool.query(
      "UPDATE messages SET message_content = NULL, images_url = NULL, is_deleted = 1 WHERE id = ?",
      [id],
    );
    return existing;
  }

  static toResponse(row) {
    if (!row) return null;
    return {
      message_id: row.id,
      sender_id: row.sender_id,
      receiver_id: row.receiver_id,
      message_content: row.is_deleted ? null : row.message_content,
      images_url: row.is_deleted ? null : row.images_url,
      timestamp: row.timestamp,
      is_read: Boolean(row.is_read),
      is_edited: Boolean(row.is_edited),
      is_deleted: Boolean(row.is_deleted),
    };
  }
}

export default Message;
