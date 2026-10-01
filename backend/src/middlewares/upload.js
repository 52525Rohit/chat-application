import multer from "multer";
import path from "path";
import pool from "../config/database.js";

// Files live in the `uploads` table because Render's disk is wiped on restart.

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Runs after upload.single(): stores the file in MySQL and sets req.file.filename
export const saveUpload = async (req, res, next) => {
  if (!req.file) return next();

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}${path.extname(req.file.originalname)}`;

  try {
    await pool.query(
      "INSERT INTO uploads (name, mime_type, data) VALUES (?, ?, ?)",
      [filename, req.file.mimetype, req.file.buffer],
    );
    req.file.filename = filename;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const removeUpload = (filename) =>
  pool.query("DELETE FROM uploads WHERE name = ?", [filename]).catch(() => {});

export const serveUpload = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT mime_type, data FROM uploads WHERE name = ?",
      [req.params.name],
    );
    if (!rows[0]) return res.sendStatus(404);

    res.set("Content-Type", rows[0].mime_type);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(rows[0].data);
  } catch (error) {
    return next(error);
  }
};
