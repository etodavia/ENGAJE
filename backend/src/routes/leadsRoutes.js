const express = require('express');
const router = express.Router();
const { checkDatabaseConnection, executeQuery } = require('../config/db');
const { initialDemoStore } = require('../data/demoSeedData');

const SERVICOS_PERMITIDOS = [
  'Diagnóstico e Consultoria Técnica',
  'Engajamento 360º',
  'Engajamento Evolutivo',
  'Engaja+',
  'Capacitação de Equipes e Lideranças',
  'Processos e Documentação Sanitária',
  'Interesse no App Engaje (Em planejamento)'
];

function sanitizeText(value = '', maxLen = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[<>]/g, '').slice(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * POST /api/leads
 * Valida e persiste um novo contato comercial enviado pela Landing Page na tabela MySQL `leads`.
 */
router.post('/', async (req, res) => {
  try {
    const {
      nome,
      empresa,
      email,
      telefone,
      servico_interesse,
      mensagem,
      consentimento,
      website_url // Campo Honeypot contra bots automatizados
    } = req.body || {};

    // 1. Verificação Honeypot: se preenchido por robôs, retorna sucesso silencioso sem gravar
    if (website_url && String(website_url).trim().length > 0) {
      return res.status(200).json({
        ok: true,
        message: 'Recebemos seu contato com sucesso.'
      });
    }

    // 2. Sanitização e minimização de dados (LGPD)
    const cleanNome = sanitizeText(nome, 120);
    const cleanEmpresa = sanitizeText(empresa, 120);
    const cleanEmail = sanitizeText(email, 160).toLowerCase();
    const cleanTelefone = sanitizeText(telefone, 40);
    const cleanServico = sanitizeText(servico_interesse, 100);
    const cleanMensagem = sanitizeText(mensagem, 2000);
    const cleanConsentimento = Boolean(consentimento) === true;

    // 3. Validação rigorosa no servidor
    const fieldErrors = {};

    if (!cleanNome || cleanNome.length < 3) {
      fieldErrors.nome = 'Informe seu nome completo (mínimo de 3 caracteres).';
    }
    if (!cleanEmpresa || cleanEmpresa.length < 2) {
      fieldErrors.empresa = 'Informe o nome do supermercado ou empresa.';
    }
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      fieldErrors.email = 'Informe um endereço de e-mail corporativo ou pessoal válido.';
    }
    if (!cleanTelefone || !isValidPhone(cleanTelefone)) {
      fieldErrors.telefone = 'Informe um telefone ou WhatsApp válido com DDD (10 a 15 dígitos).';
    }
    if (!cleanServico || !SERVICOS_PERMITIDOS.includes(cleanServico)) {
      fieldErrors.servico_interesse = 'Selecione um serviço ou programa de interesse válido.';
    }
    if (!cleanMensagem || cleanMensagem.length < 10) {
      fieldErrors.mensagem = 'Descreva brevemente a necessidade da sua operação (mínimo de 10 caracteres).';
    }
    if (!cleanConsentimento) {
      fieldErrors.consentimento = 'É necessário autorizar o contato e o tratamento dos dados conforme a Política de Privacidade.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        ok: false,
        error: 'Por favor, verifique os campos destacados no formulário.',
        fieldErrors
      });
    }

    // 4. Persistência com consulta parametrizada no MySQL
    const mysqlOnline = await checkDatabaseConnection();

    if (mysqlOnline) {
      const insertSql = `
        INSERT INTO leads
          (nome, empresa, email, telefone, servico_interesse, mensagem, consentimento)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await executeQuery(insertSql, [
        cleanNome,
        cleanEmpresa,
        cleanEmail,
        cleanTelefone,
        cleanServico,
        cleanMensagem,
        cleanConsentimento ? 1 : 0
      ]);

      return res.status(201).json({
        ok: true,
        leadId: result.insertId,
        storage: 'mysql',
        message: 'Solicitação registrada com sucesso! A equipe da Engaje Soluções entrará em contato em breve para agendar sua conversa de diagnóstico.'
      });
    }

    // Fallback seguro de demonstração local caso o serviço MySQL ainda não esteja ativo na máquina
    const fallbackLead = {
      id: initialDemoStore.leads.length + 1,
      nome: cleanNome,
      empresa: cleanEmpresa,
      email: cleanEmail,
      telefone: cleanTelefone,
      servico_interesse: cleanServico,
      mensagem: cleanMensagem,
      consentimento: 1,
      criado_em: new Date().toISOString()
    };
    initialDemoStore.leads.push(fallbackLead);

    return res.status(201).json({
      ok: true,
      leadId: fallbackLead.id,
      storage: 'demo_local_mirror',
      message: 'Solicitação registrada com sucesso! A equipe da Engaje Soluções entrará em contato em breve para agendar sua conversa de diagnóstico.'
    });
  } catch (error) {
    console.error('[POST /api/leads] Erro ao processar envio:', error.message);
    return res.status(500).json({
      ok: false,
      error: 'Não foi possível registrar seu contato neste momento. Por favor, tente novamente ou fale conosco pelo WhatsApp.'
    });
  }
});

module.exports = router;
