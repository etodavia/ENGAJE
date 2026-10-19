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

// ConfiguraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de CORS segura baseada em variÃƒÆ’Ã‚Â¡vel de ambiente
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-engaje-role']
  })
);

// CabeÃƒÆ’Ã‚Â§alhos bÃƒÆ’Ã‚Â¡sicos de seguranÃƒÆ’Ã‚Â§a HTTP
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '64kb' }));

// Endpoint de verificaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de saÃƒÆ’Ã‚Âºde da API e status do MySQL
app.get('/api/health', async (req, res) => {
  const mysqlOnline = await checkDatabaseConnection();
  res.json({
    ok: true,
    service: 'Engaje SoluÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes API',
    mysqlConnected: mysqlOnline,
    mode: mysqlOnline ? 'mysql_persistent' : 'demo_mirror_ready',
    timestamp: new Date().toISOString()
  });
});

// Rotas pÃƒÆ’Ã‚Âºblicas da Landing Page (Leads)
app.use('/api/leads', leadsRoutes);

// Rotas do ProtÃƒÆ’Ã‚Â³tipo Conceitual do App Engaje
app.use('/api/app', appRoutes);

// Tratamento de rotas inexistentes na API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Endpoint da API nÃƒÆ’Ã‚Â£o encontrado.'
  });
});

// Servir o site (build do frontend) e fallback para rotas do React
const frontendDist = [path.resolve(__dirname, '../public'), path.resolve(__dirname, '../../frontend/dist')].find((p) => fs.existsSync(p)) || '';
if (frontendDist) {
  app.use(express.static(frontendDist, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      else res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
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
    console.log(`  ENGAJE SOLUÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã¢â‚¬Â¢ES & CONSULTORIA ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Servidor Back-end Ativo`);
    console.log(`  Porta: http://localhost:${PORT}`);
    console.log(`  Status MySQL: ${mysqlOnline ? 'Conectado (engaje_db)' : 'Modo espelho demonstrativo ativo (configure .env para MySQL)'}`);
    console.log(`============================================================`);
  });
}

module.exports = app;
