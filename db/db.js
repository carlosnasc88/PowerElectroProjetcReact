//Config do Banco de Dados
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'EletricBD',
  password: 'admin',
  port: 5432,
});

module.exports = pool;
