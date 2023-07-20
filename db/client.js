const { Pool } = require('pg');
require('dotenv').config;
const { localHostConnection } = require('../localhostconnect.js')
const connectionString = process.env.DATABASE_URL || localHostConnection;
// This Will not work when deployed
const client = new Pool(connectionString);

module.exports = client;
