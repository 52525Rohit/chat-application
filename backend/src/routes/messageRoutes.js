import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { upload } from "../middlewares/upload.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:receiverId", protect, getMessages);
router.post("/", protect, upload.single("imageFile"), sendMessage);

export default router;
