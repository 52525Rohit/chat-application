import fs from "fs/promises";
import path from "path";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { uploadsDir } from "../middlewares/upload.js";
import { getIO, getReceiverSocketId } from "../sockets/socketServer.js";

export const sendMessage = async (req, res, next) => {
  const senderId = req.user.id;
  const { receiver_id, message_content } = req.body || {};

  if (!receiver_id || (!message_content?.trim() && !req.file)) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return res.status(400).json({
      success: false,
      message:
        "receiver_id and either message_content or imageFile are required",
    });
  }

  try {
    const insertId = await Message.create({
      senderId,
      receiverId: receiver_id,
      messageContent: message_content,
      imagesUrl: req.file ? req.file.filename : null,
    });
    const newMessage = await Message.findById(insertId);
    const messageData = Message.toResponse(newMessage);

    const sender = await User.findById(senderId);
    const receiverSocketId = getReceiverSocketId(String(receiver_id));
    if (receiverSocketId) {
      getIO()
        .to(receiverSocketId)
        .emit("newMessage", {
          ...messageData,
          first_Name: sender?.FirstName,
          last_Name: sender?.lastName,
          profilePic: sender?.profile_pic,
        });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent",
      messageData,
    });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const { receiverId } = req.params;
  const senderId = req.user.id;
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const beforeId = req.query.before ? Number(req.query.before) : undefined;

  try {
    const rows = await Message.findConversationPage(senderId, receiverId, {
      limit,
      beforeId,
    });
    const messages = rows.map((row) => Message.toResponse(row));
    const hasMore = rows.length === limit;

    if (!beforeId) {
      const readCount = await Message.markConversationRead(senderId, receiverId);
      if (readCount > 0) {
        const senderSocketId = getReceiverSocketId(String(receiverId));
        if (senderSocketId) {
          getIO().to(senderSocketId).emit("messagesRead", { readerId: senderId });
        }
      }
    }

    return res.json({ success: true, messages, hasMore });
  } catch (error) {
    return next(error);
  }
};

export const editMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const senderId = req.user.id;
  const { message_content } = req.body;

  try {
    const updated = await Message.editMessage(messageId, senderId, message_content);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found or not editable" });
    }

    const messageData = Message.toResponse(updated);
    const receiverSocketId = getReceiverSocketId(String(updated.receiver_id));
    if (receiverSocketId) {
      getIO().to(receiverSocketId).emit("messageEdited", messageData);
    }

    return res.json({ success: true, messageData });
  } catch (error) {
    return next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const senderId = req.user.id;

  try {
    const deleted = await Message.softDeleteMessage(messageId, senderId);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found or not deletable" });
    }

    if (deleted.images_url) {
      await fs.unlink(path.join(uploadsDir, deleted.images_url)).catch(() => {});
    }

    const receiverSocketId = getReceiverSocketId(String(deleted.receiver_id));
    if (receiverSocketId) {
      getIO()
        .to(receiverSocketId)
        .emit("messageDeleted", { message_id: Number(messageId) });
    }

    return res.json({ success: true, message_id: Number(messageId) });
  } catch (error) {
    return next(error);
  }
};
