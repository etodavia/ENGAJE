const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  if (!user) {
    console.error('[ERRO] Variável DB_USER não definida no arquivo .env.');
    console.error('Copie o arquivo .env.example para .env e informe suas credenciais locais do MySQL.');
    process.exit(1);
  }

  let connection;
  try {
    console.log(`[MySQL] Conectando a ${host}:${port}...`);
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

    console.log('[MySQL] Executando database/schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);

    console.log('[MySQL] Executando database/seed.sql (dados demonstrativos)...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);

    console.log('[SUCESSO] Banco engaje_db, tabela leads e tabelas demonstrativas do App criados com sucesso!');
  } catch (error) {
    console.error('[ERRO] Falha ao inicializar banco MySQL:', error.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
