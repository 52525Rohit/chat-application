import "dotenv/config";

// Frontend URLs allowed to call the API and connect to the socket server.
export const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-application.rohitkumarrawani6.workers.dev",
  process.env.CLIENT_URL,
].filter(Boolean);
