import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";

const users = {};
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Not authenticated"));
    }

    try {
      const decoded = verifyToken(token);
      socket.userId = String(decoded.id);
      return next();
    } catch (error) {
      return next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, "user:", socket.userId);
    users[socket.userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(users));

    socket.on("typing", ({ to }) => {
      const receiverSocketId = users[String(to)];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { from: socket.userId });
      }
    });

    socket.on("stopTyping", ({ to }) => {
      const receiverSocketId = users[String(to)];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { from: socket.userId });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      delete users[socket.userId];
      io.emit("getOnlineUsers", Object.keys(users));
    });
  });

  return io;
};

export const getIO = () => io;
export const getReceiverSocketId = (receiverId) => users[receiverId];
