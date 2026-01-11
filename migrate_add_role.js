import { initDB } from "./database.js";

const db = await initDB();

await db.exec(`
  ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'ADMIN'
`);

console.log("Column 'role' added successfully");
process.exit();
