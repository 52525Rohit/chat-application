import pool from "../config/database.js";
import { REFRESH_TOKEN_EXPIRES_DAYS } from "../utils/jwt.js";

class RefreshToken {
  static async create({ userId, tokenHash }) {
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))",
      [userId, tokenHash, REFRESH_TOKEN_EXPIRES_DAYS],
    );
  }

  static async findValidByHash(tokenHash) {
    const [rows] = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()",
      [tokenHash],
    );
    return rows[0] || null;
  }

  static async revokeByHash(tokenHash) {
    await pool.query(
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?",
      [tokenHash],
    );
  }

  static async revokeAllForUser(userId) {
    await pool.query(
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL",
      [userId],
    );
  }
}

export default RefreshToken;
