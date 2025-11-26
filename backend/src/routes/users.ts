import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Assume uuid is installed or use crypto
import db from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, username, role, status, email, joined_date FROM users').all();
  res.json(users);
});

// Create user (Admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, username, password, role, email } = req.body;
  const id = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare('INSERT INTO users (id, name, username, password_hash, role, email) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, name, username, passwordHash, role, email);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

export default router;
