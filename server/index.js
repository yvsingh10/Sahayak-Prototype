import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import ticketsRouter from './routes/tickets.js';
import authRouter from './routes/auth.js';
import statsRouter from './routes/stats.js';
import aiRouter from './routes/ai.js';
import iotRouter from './routes/iot.js';
import { startSlaDaemon } from './services/slaDaemon.js';
import { readTickets } from './services/dataStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Ensure initial seed data exists
readTickets();

// Register REST API Endpoints (both /api/* and root /* for Vercel Serverless routing)
app.use('/api/tickets', ticketsRouter);
app.use('/tickets', ticketsRouter);

app.use('/api/auth', authRouter);
app.use('/auth', authRouter);

app.use('/api/stats', statsRouter);
app.use('/stats', statsRouter);

app.use('/api/ai', aiRouter);
app.use('/ai', aiRouter);

app.use('/api/iot', iotRouter);
app.use('/iot', iotRouter);

// Root health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    service: 'SAHAYAK Enterprise Civic Resolution REST API',
    version: '2.5.0',
    platform: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Standalone',
    timestamp: new Date().toISOString()
  });
});

// Serve compiled React frontend (Production client/dist)
const CLIENT_DIST = path.join(__dirname, '../client/dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
}

// Serve root static files (for standalone fallback)
const ROOT_DIR = path.join(__dirname, '..');
app.use(express.static(ROOT_DIR));

// Fallback SPA route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/tickets') || req.path.startsWith('/auth')) return next();
  if (fs.existsSync(path.join(CLIENT_DIST, 'index.html'))) {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  } else if (fs.existsSync(path.join(ROOT_DIR, 'sahayak_platform.html'))) {
    res.sendFile(path.join(ROOT_DIR, 'sahayak_platform.html'));
  } else {
    res.send('SAHAYAK Platform Backend Active');
  }
});

// Start the 48-Hour SLA & Priority Monitoring Daemon (skip in Vercel serverless)
if (!process.env.VERCEL) {
  startSlaDaemon(12000);
}

// Start HTTP Server (Listens on process.env.PORT for Vercel Services & local environments)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 SAHAYAK Full-Stack Application Running!`);
    console.log(`🌐 Web UI & API: http://localhost:${PORT}`);
    console.log(`📌 5-Stage Life-Cycle REST API Active`);
    console.log(`====================================================`);
  });
}

export default app;
