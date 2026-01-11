import bcrypt from "bcrypt";
import { initDB } from "./db.js";

const db = await initDB();

const hashed = await bcrypt.hash("admin123", 10);

await db.run(
  "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
  ["admin", hashed, "ADMIN"]
);

console.log("Admin user created");
process.exit();
