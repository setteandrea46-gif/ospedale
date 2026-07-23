import express from 'express';
import { pool } from '../db/index.js';
import { decrypt, encrypt } from '../utils/crypto.js';
const router = express.Router();
export const publicRouter = express.Router();

async function buildEmergencySummary(userId) {
  const profileResult = await pool.query('SELECT * FROM profile WHERE user_id = $1', [userId]);
  const medicationsResult = await pool.query('SELECT * FROM medications WHERE user_id = $1 ORDER BY start_date DESC', [userId]);
  const profile = profileResult.rows[0] || null;
  const details = profile?.emergency_details ? JSON.parse(decrypt(profile.emergency_details)) : {};
  return {
    userId,
    name: [profile?.name, profile?.surname].filter(Boolean).join(' ') || 'Paziente',
    dob: profile?.dob,
    sex: profile?.sex,
    height: profile?.height,
    weight: profile?.weight,
    fiscalCode: profile?.fiscal_code,
    bloodType: details.bloodType || '',
    organDonor: Boolean(details.organDonor),
    allergies: {
      drug: details.drugAllergies || '',
      food: details.foodAllergies || '',
      environmental: details.environmentalAllergies || ''
    },
    chronicIssues: details.selectedConditions || [],
    emergencyContacts: [
      { name: details.emergencyContact || '', phone: details.emergencyPhone || '' },
      { name: details.secondEmergencyContact || '', phone: details.secondEmergencyPhone || '' }
    ].filter((item) => item.name || item.phone),
    medications: medicationsResult.rows.map((medication) => ({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      route: medication.route,
      reason: medication.reason,
      prescriber: medication.prescriber,
      notes: medication.notes
    }))
  };
}

router.get('/', async (req, res, next) => {
  try {
    res.json({ emergency: await buildEmergencySummary(req.user.id) });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { bloodType, organDonor, drugAllergies, foodAllergies, environmentalAllergies, medications } = req.body;
    const encrypted = encrypt(JSON.stringify({ bloodType, organDonor, drugAllergies, foodAllergies, environmentalAllergies, medications }));
    const existing = await pool.query('SELECT id FROM emergency WHERE user_id = $1', [req.user.id]);
    if (existing.rowCount) {
      await pool.query('UPDATE emergency SET emergency_data = $1 WHERE user_id = $2', [encrypted, req.user.id]);
    } else {
      await pool.query('INSERT INTO emergency (user_id, emergency_data) VALUES ($1, $2)', [req.user.id, encrypted]);
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

publicRouter.get('/:userId', async (req, res, next) => {
  try {
    res.json({ emergency: await buildEmergencySummary(req.params.userId) });
  } catch (err) {
    next(err);
  }
});

export default router;
