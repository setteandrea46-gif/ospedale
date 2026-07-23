import express from 'express';
import { pool } from '../db/index.js';
const router = express.Router();
const emptyToNull = (value) => value === '' || value === undefined ? null : value;

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM appointments WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    res.json({ appointments: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, type, doctor, facility, address, date, notes, reportId } = req.body;
    await pool.query(
      'INSERT INTO appointments (user_id, title, type, doctor, facility, address, date, notes, report_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [req.user.id, title, type, doctor, facility, address, emptyToNull(date), notes, emptyToNull(reportId)]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
