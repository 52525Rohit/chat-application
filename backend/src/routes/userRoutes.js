import express from "express";
import {
  getAllUsers,
  createUser,
  updateProfilePic,
} from "../controllers/userController.js";
import { upload, saveUpload } from "../middlewares/upload.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/allUser", protect, getAllUsers);
router.post("/addUser", createUser);
router.post(
  "/updateProfile",
  protect,
  upload.single("imageFile"),
  saveUpload,
  updateProfilePic,
);

export default router;
