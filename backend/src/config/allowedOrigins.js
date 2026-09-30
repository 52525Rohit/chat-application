import "dotenv/config";

export const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-application.rohitkumarrawani6.workers.dev",
  process.env.CLIENT_URL,
].filter(Boolean);
