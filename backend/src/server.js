const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { checkDatabaseConnection } = require('./config/db');
const leadsRoutes = require('./routes/leadsRoutes');
const appRoutes = require('./routes/appRoutes');

const app = express();
const PORT = Number(process.env.PORT || 3001);

// ConfiguraÃƒÂ§ÃƒÂ£o de CORS segura baseada em variÃƒÂ¡vel de ambiente
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-engaje-role']
  })
);

// CabeÃƒÂ§alhos bÃƒÂ¡sicos de seguranÃƒÂ§a HTTP
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '64kb' }));

// Endpoint de verificaÃƒÂ§ÃƒÂ£o de saÃƒÂºde da API e status do MySQL
app.get('/api/health', async (req, res) => {
  const mysqlOnline = await checkDatabaseConnection();
  res.json({
    ok: true,
    service: 'Engaje SoluÃƒÂ§ÃƒÂµes API',
    mysqlConnected: mysqlOnline,
    mode: mysqlOnline ? 'mysql_persistent' : 'demo_mirror_ready',
    timestamp: new Date().toISOString()
  });
});

// Rotas pÃƒÂºblicas da Landing Page (Leads)
app.use('/api/leads', leadsRoutes);

// Rotas do ProtÃƒÂ³tipo Conceitual do App Engaje
app.use('/api/app', appRoutes);

// Tratamento de rotas inexistentes na API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Endpoint da API nÃƒÂ£o encontrado.'
  });
});

// Servir o site (build do frontend) e fallback para rotas do React
const frontendDist = [path.resolve(__dirname, '../public'), path.resolve(__dirname, '../../frontend/dist')].find((p) => fs.existsSync(p)) || '';
if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

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
    console.log(`  ENGAJE SOLUÃƒâ€¡Ãƒâ€¢ES & CONSULTORIA Ã¢â‚¬â€ Servidor Back-end Ativo`);
    console.log(`  Porta: http://localhost:${PORT}`);
    console.log(`  Status MySQL: ${mysqlOnline ? 'Conectado (engaje_db)' : 'Modo espelho demonstrativo ativo (configure .env para MySQL)'}`);
    console.log(`============================================================`);
  });
}

module.exports = app;
