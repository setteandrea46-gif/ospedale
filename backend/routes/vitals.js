import express from 'express';
import { pool } from '../db/index.js';
const router = express.Router();
const emptyToNull = (value) => value === '' || value === undefined ? null : value;

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM vitals WHERE user_id = $1 ORDER BY recorded_at DESC', [req.user.id]);
    res.json({ vitals: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { type, systolic, diastolic, heartRate, oxygen, glucose, weight, bmi, temperature, cholesterolTotal, ldl, hdl, triglycerides, hemoglobin, creatinine, tsh, recordedAt, notes } = req.body;
    await pool.query(
      'INSERT INTO vitals (user_id, type, systolic, diastolic, heart_rate, oxygen, glucose, weight, bmi, temperature, cholesterol_total, ldl, hdl, triglycerides, hemoglobin, creatinine, tsh, recorded_at, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)',
      [req.user.id, type, emptyToNull(systolic), emptyToNull(diastolic), emptyToNull(heartRate), emptyToNull(oxygen), emptyToNull(glucose), emptyToNull(weight), emptyToNull(bmi), emptyToNull(temperature), emptyToNull(cholesterolTotal), emptyToNull(ldl), emptyToNull(hdl), emptyToNull(triglycerides), emptyToNull(hemoglobin), emptyToNull(creatinine), emptyToNull(tsh), emptyToNull(recordedAt), notes]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
