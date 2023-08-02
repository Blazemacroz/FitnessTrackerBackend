const { Pool } = require('pg');
require('dotenv').config();
// const { localHostConnection } = require('../localhostconnect.js')
const connectionString = process.env.DATABASE_URL;

const client = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

module.exports = client;