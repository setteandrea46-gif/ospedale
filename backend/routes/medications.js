import express from 'express';
import { pool } from '../db/index.js';
const router = express.Router();
const emptyToNull = (value) => value === '' || value === undefined ? null : value;

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM medications WHERE user_id = $1 ORDER BY start_date DESC', [req.user.id]);
    res.json({ medications: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, ingredient, dosage, frequency, route, reason, startDate, endDate, prescriber, notes } = req.body;
    await pool.query(
      'INSERT INTO medications (user_id, name, ingredient, dosage, frequency, route, reason, start_date, end_date, prescriber, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
      [req.user.id, name, ingredient, dosage, frequency, route, reason, emptyToNull(startDate), emptyToNull(endDate), prescriber, notes]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
