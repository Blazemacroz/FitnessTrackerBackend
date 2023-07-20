const { Pool } = require('pg');
require('dotenv').config;
const { localHostConnection } = require('../localhostconnect.js')
// This Will not work when deployed
const client = new Pool(localHostConnection);

module.exports = client;
