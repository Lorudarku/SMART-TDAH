const { Pool } = require('pg');

const pool = new Pool({
  user: 'angel',
  host: 'localhost',
  database: 'gpt-tdah',
  password: 'abc123.',
  port: 5432,
});

module.exports = pool;