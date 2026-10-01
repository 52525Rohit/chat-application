import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { removeUpload } from "../middlewares/upload.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const rows = await User.findAll();
    const users = rows.map((row) => User.toResponse(row));
    return res.json({ success: true, users });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.updateProfile(req.user.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      message: "Profile updated",
      user: User.toResponse(updatedUser),
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProfilePic = async (req, res, next) => {
  const employeeId = req.user.id;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "imageFile is required",
    });
  }

  try {
    const previousUser = await User.findById(employeeId);
    if (!previousUser) {
      await removeUpload(req.file.filename);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedUser = await User.updateProfilePic(employeeId, req.file.filename);

    if (previousUser.profile_pic) {
      await removeUpload(previousUser.profile_pic);
    }

    return res.json({
      success: true,
      message: "Profile picture updated",
      user: User.toResponse(updatedUser),
    });
  } catch (error) {
    await removeUpload(req.file.filename);
    return next(error);
  }
};

export const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password, mobile } = req.body;

  if (!firstName || !lastName || !email || !password || !mobile) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existing = await User.findByEmail(email);
    if (existing) {
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
    });
    const newUser = await User.findById(insertId);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: User.toResponse(newUser),
    });
  } catch (error) {
    return next(error);
  }
};
