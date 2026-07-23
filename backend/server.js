import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import emergencyRoutes from './routes/emergency.js';
import archiveRoutes from './routes/archive.js';
import calendarRoutes from './routes/calendar.js';
import medicationRoutes from './routes/medications.js';
import vitalsRoutes from './routes/vitals.js';
import vaccinesRoutes from './routes/vaccines.js';
import { publicRouter as emergencyPublicRoutes } from './routes/emergency.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/public/emergency', emergencyPublicRoutes);
app.use('/api/profile', authenticate, profileRoutes);
app.use('/api/emergency', authenticate, emergencyRoutes);
app.use('/api/archive', authenticate, archiveRoutes);
app.use('/api/calendar', authenticate, calendarRoutes);
app.use('/api/medications', authenticate, medicationRoutes);
app.use('/api/vitals', authenticate, vitalsRoutes);
app.use('/api/vaccines', authenticate, vaccinesRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`MedCard backend in ascolto su http://localhost:${port}`);
});
