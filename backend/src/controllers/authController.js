import fs from "fs/promises";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/jwt.js";

const issueTokens = async (user) => {
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken();
  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashRefreshToken(refreshToken),
  });
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password, mobile } = req.body || {};

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
    const { accessToken, refreshToken } = await issueTokens(newUser);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: User.toResponse(newUser),
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

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

    const { accessToken, refreshToken } = await issueTokens(userRow);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: User.toResponse(userRow),
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const tokenHash = hashRefreshToken(refreshToken);
    const stored = await RefreshToken.findValidByHash(tokenHash);
    if (!stored) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(stored.user_id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    await RefreshToken.revokeByHash(tokenHash);
    const tokens = await issueTokens(user);

    return res.json({
      success: true,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.body || {};

  try {
    if (refreshToken) {
      await RefreshToken.revokeByHash(hashRefreshToken(refreshToken));
    }
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return next(error);
  }
};
