const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { checkDatabaseConnection } = require('./config/db');
const leadsRoutes = require('./routes/leadsRoutes');
const appRoutes = require('./routes/appRoutes');

const app = express();
const PORT = Number(process.env.PORT || 3001);

// Configuração de CORS segura baseada em variável de ambiente
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-engaje-role']
  })
);

// Cabeçalhos básicos de segurança HTTP
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '64kb' }));

// Endpoint de verificação de saúde da API e status do MySQL
app.get('/api/health', async (req, res) => {
  const mysqlOnline = await checkDatabaseConnection();
  res.json({
    ok: true,
    service: 'Engaje Soluções API',
    mysqlConnected: mysqlOnline,
    mode: mysqlOnline ? 'mysql_persistent' : 'demo_mirror_ready',
    timestamp: new Date().toISOString()
  });
});

// Rotas públicas da Landing Page (Leads)
app.use('/api/leads', leadsRoutes);

// Rotas do Protótipo Conceitual do App Engaje
app.use('/api/app', appRoutes);

// Tratamento de rotas inexistentes na API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Endpoint da API não encontrado.'
  });
});

// Tratamento global de erros sem vazar stack trace ou segredos
app.use((err, req, res, next) => {
  console.error('[API Error]', err.message);
  res.status(500).json({
    ok: false,
    error: 'Erro interno no servidor.'
  });
});

if (require.main === module) {
  app.listen(PORT, async () => {
    const mysqlOnline = await checkDatabaseConnection();
    console.log(`============================================================`);
    console.log(`  ENGAJE SOLUÇÕES & CONSULTORIA — Servidor Back-end Ativo`);
    console.log(`  Porta: http://localhost:${PORT}`);
    console.log(`  Status MySQL: ${mysqlOnline ? 'Conectado (engaje_db)' : 'Modo espelho demonstrativo ativo (configure .env para MySQL)'}`);
    console.log(`============================================================`);
  });
}

module.exports = app;
