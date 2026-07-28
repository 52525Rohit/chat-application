import fs from "fs/promises";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password, mobile } = req.body || {};

  if (!firstName || !lastName || !email || !password || !mobile) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return res.status(400).json({
      success: false,
      message: "All registration fields are required",
    });
  }

  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertId = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      profilePic: req.file ? req.file.filename : null,
    });
    const newUser = await User.findById(insertId);
    const token = generateToken({ id: newUser.id, email: newUser.email });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: User.toResponse(newUser),
      token,
    });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const userRow = await User.findByEmail(email);
    if (!userRow) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, userRow.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken({ id: userRow.id, email: userRow.email });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: User.toResponse(userRow),
      token,
    });
  } catch (error) {
    return next(error);
  }
};
