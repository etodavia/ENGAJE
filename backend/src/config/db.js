const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;
let mysqlConnected = false;

/**
 * Cria ou retorna o pool de conexões MySQL configurado exclusivamente via variáveis de ambiente (.env).
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'engaje_db',
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
      queueLimit: 0,
      charset: 'utf8mb4'
    });
  }
  return pool;
}

/**
 * Verifica se a conexão com o MySQL está ativa e disponível.
 */
async function checkDatabaseConnection() {
  if (!process.env.DB_USER) {
    mysqlConnected = false;
    return false;
  }
  try {
    const activePool = getPool();
    const connection = await activePool.getConnection();
    await connection.ping();
    connection.release();
    mysqlConnected = true;
    return true;
  } catch (error) {
    mysqlConnected = false;
    return false;
  }
}

/**
 * Executa uma consulta SQL parametrizada (prepared statement) prevenindo SQL Injection.
 */
async function executeQuery(sql, params = []) {
  const activePool = getPool();
  const [rows] = await activePool.execute(sql, params);
  return rows;
}

function isMysqlAvailable() {
  return mysqlConnected;
}

module.exports = {
  getPool,
  checkDatabaseConnection,
  executeQuery,
  isMysqlAvailable
};
