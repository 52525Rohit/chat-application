import express from "express";
import { login, register, refresh, logout } from "../controllers/authController.js";
import { upload, saveUpload } from "../middlewares/upload.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema, refreshSchema } from "../validations/authValidation.js";

const router = express.Router();

router.post("/login", authLimiter, validate(loginSchema), login);
router.post(
  "/register",
  authLimiter,
  upload.single("imageFile"),
  saveUpload,
  validate(registerSchema),
  register,
);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", logout);

export default router;
