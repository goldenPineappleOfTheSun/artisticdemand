const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
    connectionString: config.pg.connectionString,
    ssl: true,
});

module.exports = pool;
