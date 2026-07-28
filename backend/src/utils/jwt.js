import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
export const REFRESH_TOKEN_EXPIRES_DAYS = Number(
  process.env.JWT_REFRESH_EXPIRES_DAYS || 30,
);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in the environment");
}

export const generateAccessToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

export const generateRefreshToken = () => crypto.randomBytes(40).toString("hex");

export const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
