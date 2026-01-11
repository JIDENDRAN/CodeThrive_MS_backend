// db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let dbInstance = null;

export async function initDB() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: "./db/database.sqlite",
      driver: sqlite3.Database,
    });

    // Create tables if not exist
    await dbInstance.exec(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )`);

    await dbInstance.exec(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_type TEXT,
      title TEXT,
      description TEXT,
      technology TEXT,
      total_fee REAL,
      status TEXT,
      students TEXT,
      client TEXT,
      guides TEXT,
      payments TEXT
    )`);
  }
  return dbInstance;
}
