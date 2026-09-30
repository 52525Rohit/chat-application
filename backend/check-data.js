import pool from "./src/config/database.js";

async function verifyData() {
  try {
    console.log("Checking Database Content...\n");

    const [tables] = await pool.query("SHOW TABLES");
    console.log("Tables found in Database:", tables);

    const [empCount] = await pool.query(
      "SELECT COUNT(*) AS total FROM employees",
    );
    const [msgCount] = await pool.query(
      "SELECT COUNT(*) AS total FROM messages",
    );
    const [tokenCount] = await pool.query(
      "SELECT COUNT(*) AS total FROM refresh_tokens",
    );

    console.log("\nRecord Summary:");
    console.log(`• employees: ${empCount[0].total} rows`);
    console.log(`• messages: ${msgCount[0].total} rows`);
    console.log(`• refresh_tokens: ${tokenCount[0].total} rows`);

    process.exit(0);
  } catch (err) {
    console.error("Verification failed:", err.message);
    process.exit(1);
  }
}

verifyData();
