import dotenv from "dotenv";
import pool from "../config/database.js";

dotenv.config();

const columnExists = async (table, column) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column],
  );
  return rows[0].count > 0;
};

const tableExists = async (table) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table],
  );
  return rows[0].count > 0;
};

const run = async () => {
  if (!(await columnExists("messages", "is_edited"))) {
    await pool.query(
      "ALTER TABLE messages ADD COLUMN is_edited TINYINT(1) NOT NULL DEFAULT 0",
    );
    console.log("Added messages.is_edited");
  }

  if (!(await columnExists("messages", "is_deleted"))) {
    await pool.query(
      "ALTER TABLE messages ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0",
    );
    console.log("Added messages.is_deleted");
  }

  if (!(await tableExists("refresh_tokens"))) {
    await pool.query(`
      CREATE TABLE refresh_tokens (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        token_hash CHAR(64) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        revoked_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY idx_token_hash (token_hash),
        KEY idx_user_id (user_id),
        CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log("Created refresh_tokens table");
  }

  console.log("Migration complete");
  process.exit(0);
};

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
