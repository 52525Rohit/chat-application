import express from "express";
import {
  getAllUsers,
  createUser,
  updateProfilePic,
  updateProfile,
} from "../controllers/userController.js";
import { upload, saveUpload } from "../middlewares/upload.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { updateProfileSchema } from "../validations/authValidation.js";

const router = express.Router();

router.get("/allUser", protect, getAllUsers);
router.patch("/profile", protect, validate(updateProfileSchema), updateProfile);
router.post("/addUser", createUser);
router.post(
  "/updateProfile",
  protect,
  upload.single("imageFile"),
  saveUpload,
  updateProfilePic,
);

export default router;
