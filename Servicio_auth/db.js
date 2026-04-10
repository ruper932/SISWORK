/**
 * db.js — Pool de conexión a PostgreSQL (XAMPP)
 * Servicio_auth / SISWORK
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'siswork_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // Conexiones simultáneas máximas
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificar conexión al arrancar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌  Error conectando a PostgreSQL:', err.message);
    return;
  }
  release();
  console.log('✅  Conectado a PostgreSQL — siswork_db');
});

module.exports = pool;