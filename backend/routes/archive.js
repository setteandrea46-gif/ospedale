import express from 'express';
import multer from 'multer';
import { pool } from '../db/index.js';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const emptyToNull = (value) => value === '' || value === undefined ? null : value;

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM archive WHERE user_id = $1 ORDER BY uploaded_at DESC', [req.user.id]);
    res.json({ archive: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const { category, date, doctor, notes, tags, title } = req.body;
    const filePath = req.file ? req.file.path : null;
    await pool.query(
      'INSERT INTO archive (user_id, category, title, file_path, date, doctor, notes, tags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [req.user.id, category, title, filePath, emptyToNull(date), doctor, notes, tags ? JSON.stringify(tags.split(',').map((tag) => tag.trim())) : []]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
