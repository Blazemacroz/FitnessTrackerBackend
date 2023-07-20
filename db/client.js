const { Pool } = require('pg');
require('dotenv').config;
const { localHostConnection } = require('../localhostconnect.js')
const connectionString = localHostConnection || process.env.DATABASE_URL;
console.log(connectionString)
const client = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

module.exports = client;
