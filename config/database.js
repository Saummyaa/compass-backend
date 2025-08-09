const { Pool } = require('pg');
require('dotenv').config();

// Configure pool with connection string or individual parameters
const poolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 60000,
  ssl: { rejectUnauthorized: false }
};

// Use DATABASE_URL if available, otherwise use individual parameters
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
} else {
  poolConfig.host = process.env.DB_HOST || 'trolley.proxy.rlwy.net';
  poolConfig.port = process.env.DB_PORT || 18488;
  poolConfig.database = process.env.DB_NAME || 'railway';
  poolConfig.user = process.env.DB_USER || 'postgres';
  poolConfig.password = process.env.DB_PASSWORD || 'OBhKBiZXjwCGbbsLyoZPuuEDiOLkYkXL';
}

const pool = new Pool(poolConfig);

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
