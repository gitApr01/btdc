import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get cases (Filtered by role)
router.get('/', authenticateToken, (req: any, res) => {
  const user = req.user;
  
  if (user.role === 'admin') {
    const cases = db.prepare('SELECT * FROM cases').all();
    // Fetch test IDs for each case (simplified for brevity)
    res.json(cases);
  } else {
    const cases = db.prepare('SELECT * FROM cases WHERE user_id = ?').all(user.id);
    res.json(cases);
  }
});

// Create case
router.post('/', authenticateToken, (req: any, res) => {
  const { patientName, age, sex, mobileNumber, totalAmount, advanceAmount, testIds } = req.body;
  const id = crypto.randomUUID();
  const userId = req.user.id;

  const dueAmount = totalAmount - advanceAmount;
  const commissionAmount = totalAmount * 0.40;
  const status = dueAmount <= 0 ? 'paid' : advanceAmount > 0 ? 'partial' : 'due';

  const insertCase = db.transaction(() => {
    db.prepare(`
      INSERT INTO cases (id, patient_name, age, sex, mobile_number, total_amount, advance_amount, due_amount, commission_amount, status, user_id, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'))
    `).run(id, patientName, age, sex, mobileNumber, totalAmount, advanceAmount, dueAmount, commissionAmount, status, userId);

    const insertTest = db.prepare('INSERT INTO case_tests (case_id, test_id) VALUES (?, ?)');
    for (const testId of testIds) {
      insertTest.run(id, testId);
    }
  });

  try {
    insertCase();
    res.status(201).json({ message: 'Case created' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating case', error });
  }
});

export default router;
