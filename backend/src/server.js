import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initSocket } from "./sockets/socketServer.js";
import { testConnection } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

testConnection().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
});
