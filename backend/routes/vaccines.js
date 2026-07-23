import express from 'express';
import { pool } from '../db/index.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM vaccines WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    res.json({ vaccines: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, date, lot, facility, doctor, notes } = req.body;
    await pool.query(
      'INSERT INTO vaccines (user_id, vaccine_name, date, lot, facility, doctor, notes) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [req.user.id, name, date, lot, facility, doctor, notes]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
