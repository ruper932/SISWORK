/**
 * server.js — Microservicio de autenticación
 * Servicio_auth / SISWORK
 *
 * Rutas disponibles:
 *   POST   /api/auth/login
 *   POST   /api/auth/logout          (requiere token)
 *   POST   /api/auth/forgot-password
 *   GET    /api/auth/me              (requiere token)
 *   GET    /api/auth/health          (ping)
 */

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');

const { login, logout, forgotPassword, getMe } = require('./authController');
const { verificarToken } = require('./authMiddleware');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Middlewares globales ───────────────────────────────────── */
app.use(cors({
  origin: '*', // En producción limitar al dominio del frontend
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));

/* ── Rutas públicas ─────────────────────────────────────────── */
app.post('/api/auth/login',           login);
app.post('/api/auth/forgot-password', forgotPassword);

/* ── Rutas protegidas (requieren JWT válido) ────────────────── */
app.post('/api/auth/logout', verificarToken, logout);
app.get ('/api/auth/me',     verificarToken, getMe);

/* ── Health check ───────────────────────────────────────────── */
app.get('/api/auth/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'Servicio_auth', timestamp: new Date() });
});

/* ── 404 catch-all ──────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

/* ── Arrancar servidor ──────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`🚀  Servicio_auth corriendo en http://localhost:${PORT}`);
  console.log(`📋  Endpoints:`);
  console.log(`    POST http://localhost:${PORT}/api/auth/login`);
  console.log(`    POST http://localhost:${PORT}/api/auth/logout`);
  console.log(`    POST http://localhost:${PORT}/api/auth/forgot-password`);
  console.log(`    GET  http://localhost:${PORT}/api/auth/me`);
  console.log(`    GET  http://localhost:${PORT}/api/auth/health`);
});