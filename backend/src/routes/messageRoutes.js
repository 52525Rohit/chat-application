import express from "express";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import { upload } from "../middlewares/upload.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { sendMessageSchema, editMessageSchema } from "../validations/messageValidation.js";

const router = express.Router();

router.get("/:receiverId", protect, getMessages);
router.post(
  "/",
  protect,
  upload.single("imageFile"),
  validate(sendMessageSchema),
  sendMessage,
);
router.patch("/:messageId", protect, validate(editMessageSchema), editMessage);
router.delete("/:messageId", protect, deleteMessage);

export default router;
