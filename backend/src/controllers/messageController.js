import fs from "fs/promises";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
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

  try {
    const rows = await Message.findConversation(senderId, receiverId);
    const messages = rows.map((row) => Message.toResponse(row));
    return res.json({ success: true, messages });
  } catch (error) {
    return next(error);
  }
};
