import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function uploadSql() {
  try {
    console.log("Connecting to Database...");
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT) || 23437,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || "chat_app",
      ssl: { rejectUnauthorized: false },
      multipleStatements: true,
    });

    console.log("Setting session variables...");
    await connection.query("SET SESSION sql_require_primary_key = 0;");

    console.log("Reading chat_app.sql...");
    const sqlPath = path.join(process.cwd(), "chat_app.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Uploading tables and data...");
    await connection.query(sql);

    console.log("All tables and data uploaded successfully!");
    await connection.end();
  } catch (err) {
    console.error("Upload failed:", err.message);
  }
}

uploadSql();
