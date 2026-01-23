import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { initDB } from "../db.js"; // shared DB connection

dotenv.config();
const router = express.Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, role = "USER" } = req.body;
    const db = await initDB(); // ✅ shared DB

    const hashed = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashed, role]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists or DB error" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await initDB(); // ✅ shared DB

    const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
