import express from 'express';
import { pool } from '../db/index.js';
import { encrypt, decrypt } from '../utils/crypto.js';
const router = express.Router();
const emptyToNull = (value) => value === '' || value === undefined ? null : value;

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM profile WHERE user_id = $1', [req.user.id]);
    const profile = result.rows[0];
    if (!profile) return res.json({ profile: null });
    const decrypted = {
      ...profile,
      emergency_details: profile.emergency_details ? JSON.parse(decrypt(profile.emergency_details)) : null
    };
    res.json({ profile: decrypted });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, surname, dob, sex, height, weight, fiscalCode, emergencyDetails } = req.body;
    const encrypted = encrypt(JSON.stringify(emergencyDetails || {}));
    const existing = await pool.query('SELECT id FROM profile WHERE user_id = $1', [req.user.id]);
    if (existing.rowCount) {
      await pool.query(
        'UPDATE profile SET name = $1, surname = $2, dob = $3, sex = $4, height = $5, weight = $6, fiscal_code = $7, emergency_details = $8 WHERE user_id = $9',
        [name, surname, emptyToNull(dob), sex, emptyToNull(height), emptyToNull(weight), fiscalCode, encrypted, req.user.id]
      );
    } else {
      await pool.query(
        'INSERT INTO profile (user_id, name, surname, dob, sex, height, weight, fiscal_code, emergency_details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [req.user.id, name, surname, emptyToNull(dob), sex, emptyToNull(height), emptyToNull(weight), fiscalCode, encrypted]
      );
    }
    const result = await pool.query('SELECT * FROM profile WHERE user_id = $1', [req.user.id]);
    const saved = result.rows[0];
    res.json({
      success: true,
      profile: {
        ...saved,
        emergency_details: saved.emergency_details ? JSON.parse(decrypt(saved.emergency_details)) : null
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
