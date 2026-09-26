import { Router } from 'express';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '../..');
const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db');

const router = Router();

// GET /api/users - คืนรายชื่อผู้ใช้ทั้งหมด
router.get('/', (req, res) => {
  const db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');
  const users = db.prepare('SELECT id, name, department, email FROM users ORDER BY id').all();
  res.json(users);
});

// GET /api/users/:id - คืนข้อมูลผู้ใช้ตาม id
router.get('/:id', (req, res) => {
  const db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');
  const user = db.prepare('SELECT id, name, department, email FROM users WHERE id = ?').get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'ไม่พบผู้ใช้ที่ระบุ' });
  }
  res.json(user);
});

export default router;
