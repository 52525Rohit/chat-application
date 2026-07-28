import pool from "../config/database.js";

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM employees WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, FirstName, lastName, email, mobile, profile_pic FROM employees WHERE id = ?",
      [id],
      
    );
    return rows[0] || null;
  }

  static async findAll() {
    const [rows] = await pool.query(
      "SELECT id, FirstName, lastName, email, mobile, profile_pic FROM employees",
    );
    return rows;
  }

  static async create({
    firstName,
    lastName,
    email,
    password,
    mobile,
    profilePic = null,
  }) {
    const [result] = await pool.query(
      "INSERT INTO employees (FirstName, lastName, email, password, mobile, profile_pic) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, password, mobile, profilePic],
    );
    return result.insertId;
  }

  static async updateProfilePic(id, profilePic) {
    await pool.query("UPDATE employees SET profile_pic = ? WHERE id = ?", [
      profilePic,
      id,
    ]);
    return this.findById(id);
  }

  static toResponse(row) {
    if (!row) return null;
    return {
      id: row.id,
      firstName: row.FirstName,
      lastName: row.lastName,
      email: row.email,
      mobile: row.mobile,
      profilePic: row.profile_pic ?? null,
    };
  }
}

export default User;
