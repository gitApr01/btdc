import express from 'express';
import db from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all tests
router.get('/', authenticateToken, (req, res) => {
  const tests = db.prepare('SELECT * FROM tests').all();
  res.json(tests);
});

// Add test (Admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, rate } = req.body;
  const id = crypto.randomUUID();

  try {
    const stmt = db.prepare('INSERT INTO tests (id, name, rate) VALUES (?, ?, ?)');
    stmt.run(id, name, rate);
    res.status(201).json({ message: 'Test created' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating test' });
  }
});

export default router;
