// backend/routes/projects.js
import express from "express";
import { initDB } from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateToken);

// GET all projects
router.get("/", async (req, res) => {
  try {
    const db = await initDB();
    const projects = await db.all("SELECT * FROM projects");
    const parsed = projects.map(p => ({
      ...p,
      students: JSON.parse(p.students || "[]"),
      client: JSON.parse(p.client || "{}"),
      guides: JSON.parse(p.guides || "[]"),
      payments: JSON.parse(p.payments || "[]"),
    }));
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// POST create project
router.post("/", async (req, res) => {
  try {
    const db = await initDB();
    const { project_type, title, description, technology, total_fee, status, students, client, guides, payments } = req.body;

    const stmt = await db.run(
      `INSERT INTO projects (project_type, title, description, technology, total_fee, status, students, client, guides, payments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      project_type,
      title,
      description,
      technology,
      total_fee,
      status,
      JSON.stringify(students || []),
      JSON.stringify(client || {}),
      JSON.stringify(guides || []),
      JSON.stringify(payments || [])
    );

    const newProject = await db.get("SELECT * FROM projects WHERE id = ?", stmt.lastID);
    newProject.students = JSON.parse(newProject.students || "[]");
    newProject.client = JSON.parse(newProject.client || "{}");
    newProject.guides = JSON.parse(newProject.guides || "[]");
    newProject.payments = JSON.parse(newProject.payments || "[]");

    res.json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT update project
router.put("/:id", async (req, res) => {
  try {
    const db = await initDB();
    const { id } = req.params;
    const { project_type, title, description, technology, total_fee, status, students, client, guides, payments } = req.body;

    await db.run(
      `UPDATE projects SET project_type=?, title=?, description=?, technology=?, total_fee=?, status=?, students=?, client=?, guides=?, payments=? WHERE id=?`,
      project_type,
      title,
      description,
      technology,
      total_fee,
      status,
      JSON.stringify(students || []),
      JSON.stringify(client || {}),
      JSON.stringify(guides || []),
      JSON.stringify(payments || []),
      id
    );

    const updated = await db.get("SELECT * FROM projects WHERE id = ?", id);
    updated.students = JSON.parse(updated.students || "[]");
    updated.client = JSON.parse(updated.client || "{}");
    updated.guides = JSON.parse(updated.guides || "[]");
    updated.payments = JSON.parse(updated.payments || "[]");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const db = await initDB();
    const { id } = req.params;
    await db.run("DELETE FROM projects WHERE id = ?", id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
