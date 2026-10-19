const express = require('express');
const router = express.Router();
const { checkDatabaseConnection, executeQuery } = require('../config/db');
const { initialDemoStore } = require('../data/demoSeedData');
const { attachDemoProfile, requireRole } = require('../middleware/authMiddleware');

router.use(attachDemoProfile);

/**
 * POST /api/app/auth/login
 * Autenticação em Modo Demonstração (Protótipo Conceitual).
 * Valida formato de e-mail e senha e retorna o perfil demonstrativo selecionado.
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, senha, perfil = 'consultora', lembrar = true } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanSenha = String(senha || '').trim();

    const fieldErrors = {};
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      fieldErrors.email = 'Informe um e-mail válido para acessar a demonstração.';
    }
    if (!cleanSenha || cleanSenha.length < 4) {
      fieldErrors.senha = 'Digite uma senha demonstrativa (mínimo de 4 caracteres).';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        ok: false,
        error: 'Verifique os campos de acesso.',
        fieldErrors
      });
    }

    const demoUser =
      initialDemoStore.usuarios.find((u) => u.email.toLowerCase() === cleanEmail) ||
      initialDemoStore.usuarios.find((u) => u.perfil === perfil) ||
      initialDemoStore.usuarios[0];

    return res.status(200).json({
      ok: true,
      isPrototypeDemo: true,
      notice: 'Acesso concedido em Modo Demonstração (Protótipo Conceitual). Nenhum dado real de produção é exposto.',
      session: {
        user: {
          ...demoUser,
          email: cleanEmail
        },
        rememberMe: Boolean(lembrar),
        authenticatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[POST /api/app/auth/login]', error.message);
    return res.status(500).json({
      ok: false,
      error: 'Erro ao iniciar sessão de demonstração.'
    });
  }
});

/**
 * GET /api/app/meta
 * Retorna unidades, departamentos e perfis disponíveis para os seletores globais do App.
 */
router.get('/meta', async (req, res) => {
  const mysqlOnline = await checkDatabaseConnection();
  return res.json({
    ok: true,
    isDemo: true,
    storage: mysqlOnline ? 'mysql' : 'demo_local_mirror',
    unidades: initialDemoStore.unidades,
    departamentos: initialDemoStore.departamentos,
    usuariosDemo: initialDemoStore.usuarios
  });
});

/**
 * GET /api/app/dashboard
 * Consolida indicadores de visão geral por unidade, período e departamento.
 */
router.get('/dashboard', async (req, res) => {
  try {
    const unidadeId = Number(req.query.unidade_id || 1);
    const departamentoSlug = String(req.query.departamento || 'todos');
    const periodo = String(req.query.periodo || '30d');

    const multiplier = periodo === '7d' ? 0.98 : periodo === '90d' ? 1.03 : 1;

    const deptsUnidade = initialDemoStore.departamentos.filter(
      (d) => d.unidade_id === unidadeId && (departamentoSlug === 'todos' || d.slug === departamentoSlug)
    );

    const rotinasFiltradas = initialDemoStore.rotinas.filter(
      (r) =>
        r.unidade_id === unidadeId &&
        (departamentoSlug === 'todos' ||
          deptsUnidade.some((d) => d.id === r.departamento_id))
    );

    const treinamentosFiltrados = initialDemoStore.treinamentos.filter(
      (t) =>
        t.unidade_id === unidadeId &&
        (departamentoSlug === 'todos' ||
          t.setor === 'Todos os setores' ||
          deptsUnidade.some((d) => d.id === t.departamento_id))
    );

    const planosFiltrados = initialDemoStore.planosAcao.filter(
      (p) =>
        p.unidade_id === unidadeId &&
        (departamentoSlug === 'todos' ||
          deptsUnidade.some((d) => d.id === p.departamento_id))
    );

    const equipesFiltradas = initialDemoStore.equipes.filter(
      (e) =>
        e.unidade_id === unidadeId &&
        (departamentoSlug === 'todos' ||
          deptsUnidade.some((d) => d.id === e.departamento_id))
    );

    const rotinasConcluidas = rotinasFiltradas.filter((r) => r.status === 'Concluída').length;
    const rotinasEmDiaPct =
      rotinasFiltradas.length > 0
        ? Math.round((rotinasConcluidas / rotinasFiltradas.length) * 100)
        : 86;

    const mediaEngajamentoBase =
      equipesFiltradas.length > 0
        ? Math.round(
            equipesFiltradas.reduce((acc, item) => acc + item.engajamento_score, 0) /
              equipesFiltradas.length
          )
        : 84;
    const engajamentoIndice = Math.min(100, Math.round(mediaEngajamentoBase * multiplier));

    const mediaTreinamentosPct =
      treinamentosFiltrados.length > 0
        ? Math.round(
            treinamentosFiltrados.reduce((acc, item) => acc + item.progresso_percentual, 0) /
              treinamentosFiltrados.length
          )
        : 78;

    const planosAtivosCount = planosFiltrados.filter((p) => p.status !== 'Concluído').length;

    const serieEvolucao = [
      { data: '20 set', engajamento: 52, rotinas: 58 },
      { data: '27 set', engajamento: 64, rotinas: 68 },
      { data: '04 out', engajamento: 73, rotinas: 76 },
      { data: '11 out', engajamento: 78, rotinas: 82 },
      { data: '18 out', engajamento: engajamentoIndice, rotinas: rotinasEmDiaPct }
    ];

    return res.json({
      ok: true,
      isDemo: true,
      filtrosAplicados: { unidadeId, departamento: departamentoSlug, periodo },
      kpis: {
        indiceEngajamento: engajamentoIndice,
        treinamentosConcluidosPct: mediaTreinamentosPct,
        treinamentosAtivosTotal: treinamentosFiltrados.length,
        rotinasEmDiaPct,
        rotinasConcluidas,
        rotinasTotal: rotinasFiltradas.length,
        planosAcaoAtivos: planosAtivosCount,
        planosAcaoTotal: planosFiltrados.length
      },
      departamentosResumo: deptsUnidade,
      equipesComparativo: equipesFiltradas,
      serieEvolucao,
      acoesPrioritarias: planosFiltrados.slice(0, 4)
    });
  } catch (error) {
    console.error('[GET /api/app/dashboard]', error.message);
    return res.status(500).json({ ok: false, error: 'Erro ao carregar dados demonstrativos do dashboard.' });
  }
});

/**
 * GET /api/app/trainings
 * Lista trilhas e capacitações com busca e filtros por setor, público e status.
 */
router.get('/trainings', async (req, res) => {
  try {
    const {
      unidade_id = 1,
      setor = 'Todos',
      publico = 'Todos',
      status = 'Todos',
      busca = ''
    } = req.query;

    const termo = String(busca || '').trim().toLowerCase();

    const lista = initialDemoStore.treinamentos.filter((item) => {
      if (Number(unidade_id) && item.unidade_id !== Number(unidade_id)) return false;
      if (setor !== 'Todos' && item.setor.toLowerCase() !== String(setor).toLowerCase()) return false;
      if (publico !== 'Todos' && item.publico.toLowerCase() !== String(publico).toLowerCase()) return false;
      if (status !== 'Todos' && item.status.toLowerCase() !== String(status).toLowerCase()) return false;
      if (termo) {
        const matchTexto =
          item.titulo.toLowerCase().includes(termo) ||
          item.eixo_tematico.toLowerCase().includes(termo) ||
          item.setor.toLowerCase().includes(termo) ||
          item.responsavel_nome.toLowerCase().includes(termo);
        if (!matchTexto) return false;
      }
      return true;
    });

    const evolucaoPorSetor = [
      { setor: 'Açougue', progresso: 82 },
      { setor: 'Padaria', progresso: 100 },
      { setor: 'Hortifruti', progresso: 35 },
      { setor: 'Mercearia', progresso: 55 },
      { setor: 'Todos os setores', progresso: 60 }
    ];

    const proximosEncontros = initialDemoStore.treinamentos
      .filter((t) => t.data_curta)
      .map((t) => ({
        id: t.id,
        titulo: t.titulo,
        publico: t.publico,
        setor: t.setor,
        ...t.data_curta
      }));

    return res.json({
      ok: true,
      isDemo: true,
      treinamentos: lista,
      evolucaoPorSetor,
      proximosEncontros
    });
  } catch (error) {
    console.error('[GET /api/app/trainings]', error.message);
    return res.status(500).json({ ok: false, error: 'Erro ao listar treinamentos demonstrativos.' });
  }
});

/**
 * POST /api/app/trainings
 * Cadastra uma nova capacitação demonstrativa no protótipo.
 */
router.post('/trainings', requireRole(['consultora', 'gestor_unidade']), async (req, res) => {
  try {
    const {
      titulo,
      eixo_tematico = 'Segurança e manipulação de alimentos',
      setor = 'Hortifruti',
      publico = 'Equipe',
      responsavel_nome = 'Dra. Thaís da Luz',
      proxima_atividade = 'Encontro agendado (Demo)'
    } = req.body || {};

    const cleanTitulo = String(titulo || '').trim();
    if (!cleanTitulo || cleanTitulo.length < 4) {
      return res.status(400).json({
        ok: false,
        error: 'Informe o título do treinamento (mínimo de 4 caracteres).'
      });
    }

    const novo = {
      id: initialDemoStore.treinamentos.length + 1,
      treinamento_id: initialDemoStore.treinamentos.length + 1,
      codigo: `TRN-DEMO-0${initialDemoStore.treinamentos.length + 1}`,
      titulo: cleanTitulo,
      eixo_tematico,
      unidade_id: 1,
      departamento_id: 3,
      setor,
      publico,
      responsavel_nome,
      progresso_percentual: 0,
      participantes_concluidos: 0,
      participantes_total: 10,
      status: 'Não iniciado',
      status_label_visual: 'Agendado',
      icone_tipo: 'document',
      proxima_atividade,
      data_curta: { dia: '30', mes: 'ABR', horario: '14:00 – 16:00', modalidade: 'Online' },
      descricao: 'Trilha demonstrativa adicionada durante a navegação no protótipo do App Engaje.',
      is_demo: 1
    };

    initialDemoStore.treinamentos.unshift(novo);

    return res.status(201).json({
      ok: true,
      isDemo: true,
      treinamento: novo
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Erro ao adicionar treinamento demonstrativo.' });
  }
});

/**
 * PATCH /api/app/trainings/:id
 * Atualiza status e progresso de um treinamento no protótipo.
 */
router.patch('/trainings/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { status, progresso_percentual } = req.body || {};
  const item = initialDemoStore.treinamentos.find((t) => t.id === id);

  if (!item) {
    return res.status(404).json({ ok: false, error: 'Treinamento demonstrativo não encontrado.' });
  }

  if (status && ['Não iniciado', 'Em andamento', 'Concluído'].includes(status)) {
    item.status = status;
    item.status_label_visual = status === 'Não iniciado' ? 'Agendado' : status;
  }
  if (typeof progresso_percentual === 'number') {
    item.progresso_percentual = Math.max(0, Math.min(100, progresso_percentual));
  } else if (status === 'Concluído') {
    item.progresso_percentual = 100;
  } else if (status === 'Em andamento' && item.progresso_percentual === 0) {
    item.progresso_percentual = 50;
  }

  return res.json({
    ok: true,
    isDemo: true,
    treinamento: item
  });
});

/**
 * GET /api/app/routines
 * Lista rotinas operacionais por setor, turno, status e busca, além do resumo lateral por setor.
 */
router.get('/routines', async (req, res) => {
  try {
    const {
      unidade_id = 1,
      setor = 'Padaria',
      turno = 'Todos',
      status = 'Todos',
      busca = ''
    } = req.query;

    const termo = String(busca || '').trim().toLowerCase();

    const todasUnidade = initialDemoStore.rotinas.filter(
      (r) => r.unidade_id === Number(unidade_id || 1)
    );

    const filtradas = todasUnidade.filter((r) => {
      if (setor !== 'Todos' && r.setor.toLowerCase() !== String(setor).toLowerCase()) return false;
      if (turno !== 'Todos' && !r.turno.toLowerCase().includes(String(turno).toLowerCase())) return false;
      if (status !== 'Todos' && r.status.toLowerCase() !== String(status).toLowerCase()) return false;
      if (termo) {
        const match =
          r.titulo.toLowerCase().includes(termo) ||
          r.descricao_curta.toLowerCase().includes(termo) ||
          r.responsavel_nome.toLowerCase().includes(termo) ||
          r.setor.toLowerCase().includes(termo);
        if (!match) return false;
      }
      return true;
    });

    // Calcula o resumo por setor em tempo real conforme tarefas são marcadas
    const setoresNomes = ['Açougue', 'Padaria', 'Hortifruti', 'Frente de caixa'];
    const resumoPorSetor = setoresNomes.map((nomeSetor) => {
      const doSetor = todasUnidade.filter((r) => r.setor.toLowerCase() === nomeSetor.toLowerCase());
      const concluidas = doSetor.filter((r) => r.status === 'Concluída').length;
      const total = doSetor.length || 1;
      const percentual = Math.round((concluidas / total) * 100);
      return {
        setor: nomeSetor,
        concluidas,
        total: doSetor.length,
        percentual
      };
    });

    return res.json({
      ok: true,
      isDemo: true,
      rotinas: filtradas,
      resumoPorSetor
    });
  } catch (error) {
    console.error('[GET /api/app/routines]', error.message);
    return res.status(500).json({ ok: false, error: 'Erro ao listar rotinas operacionais demonstrativas.' });
  }
});

/**
 * PATCH /api/app/routines/:id/status
 * Permite marcar/desmarcar uma tarefa do checklist operacional como Concluída ou Pendente.
 */
router.patch('/routines/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, observacoes } = req.body || {};

    const rotina = initialDemoStore.rotinas.find((r) => r.id === id);
    if (!rotina) {
      return res.status(404).json({ ok: false, error: 'Rotina demonstrativa não encontrada.' });
    }

    const novoStatus =
      status || (rotina.status === 'Concluída' ? 'Pendente' : 'Concluída');
    rotina.status = novoStatus;

    if (typeof observacoes === 'string' && observacoes.trim()) {
      rotina.observacoes = observacoes.trim().slice(0, 240);
    } else {
      rotina.observacoes =
        novoStatus === 'Concluída'
          ? 'Verificação concluída no protótipo.'
          : 'Pendente de verificação no turno.';
    }

    const mysqlOnline = await checkDatabaseConnection();
    if (mysqlOnline) {
      await executeQuery(
        'UPDATE rotinas_operacionais SET status = ?, observacoes = ? WHERE id = ?',
        [rotina.status, rotina.observacoes, id]
      );
    }

    return res.json({
      ok: true,
      isDemo: true,
      rotina
    });
  } catch (error) {
    console.error('[PATCH /api/app/routines/:id/status]', error.message);
    return res.status(500).json({ ok: false, error: 'Erro ao atualizar status da rotina.' });
  }
});

/**
 * POST /api/app/routines
 * Permite adicionar uma nova tarefa demonstrativa ao checklist de rotinas do setor.
 */
router.post('/routines', async (req, res) => {
  try {
    const {
      setor = 'Padaria',
      titulo,
      descricao_curta = 'Rotina demonstrativa cadastrada para verificação de padrão operacional.',
      turno = 'Abertura (manhã)',
      responsavel_nome = 'Encarregado(a) do setor',
      frequencia_prazo = 'Diária · até 09:00',
      observacoes = 'Aguardando execução no turno.'
    } = req.body || {};

    const cleanTitulo = String(titulo || '').trim();
    if (!cleanTitulo || cleanTitulo.length < 4) {
      return res.status(400).json({
        ok: false,
        error: 'Informe o nome da tarefa operacional (mínimo de 4 caracteres).'
      });
    }

    const rotinasDoSetor = initialDemoStore.rotinas.filter(
      (r) => r.setor.toLowerCase() === String(setor).toLowerCase()
    );

    const novaRotina = {
      id: initialDemoStore.rotinas.length + 1,
      ordem: rotinasDoSetor.length + 1,
      codigo: `ROT-DEMO-${initialDemoStore.rotinas.length + 1}`,
      unidade_id: 1,
      departamento_id: 2,
      setor,
      titulo: cleanTitulo,
      descricao_curta: String(descricao_curta).trim(),
      turno,
      responsavel_nome: String(responsavel_nome).trim(),
      frequencia_prazo,
      status: 'Pendente',
      observacoes: String(observacoes).trim(),
      is_demo: 1
    };

    initialDemoStore.rotinas.push(novaRotina);

    return res.status(201).json({
      ok: true,
      isDemo: true,
      rotina: novaRotina
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Erro ao criar rotina demonstrativa.' });
  }
});

/**
 * GET /api/app/reports
 * Retorna dados consolidados para a tela de Relatórios por período, unidade, setor e equipe.
 */
router.get('/reports', async (req, res) => {
  try {
    const {
      unidade_id = 1,
      periodo = '30d',
      setor = 'Todos',
      equipe = 'Todas'
    } = req.query;

    const fatorPeriodo = periodo === '7d' ? 0.35 : periodo === '90d' ? 2.6 : 1;

    const panoramaPadrao = [
      {
        setor: 'Açougue',
        icone: 'meat',
        planoAcaoPct: 78,
        capacitacaoPct: 82,
        rotinasPct: 80,
        equipeResponsavel: 'Equipe Açougue & Desossa'
      },
      {
        setor: 'Padaria',
        icone: 'bread',
        planoAcaoPct: 71,
        capacitacaoPct: 76,
        rotinasPct: 74,
        equipeResponsavel: 'Equipe Padaria & Confeitaria'
      },
      {
        setor: 'Hortifruti',
        icone: 'apple',
        planoAcaoPct: 88,
        capacitacaoPct: 91,
        rotinasPct: 90,
        equipeResponsavel: 'Equipe Hortifrúti Abertura'
      },
      {
        setor: 'Frente de caixa',
        icone: 'cart',
        planoAcaoPct: 68,
        capacitacaoPct: 72,
        rotinasPct: 75,
        equipeResponsavel: 'Equipe Atendimento & Checkouts'
      }
    ];

    const panoramaFiltrado = panoramaPadrao.filter((item) => {
      if (setor !== 'Todos' && item.setor.toLowerCase() !== String(setor).toLowerCase()) return false;
      if (equipe !== 'Todas' && item.equipeResponsavel.toLowerCase() !== String(equipe).toLowerCase()) return false;
      return true;
    });

    const mediaRotinas =
      panoramaFiltrado.length > 0
        ? Math.round(
            panoramaFiltrado.reduce((acc, i) => acc + i.rotinasPct, 0) /
              panoramaFiltrado.length
          )
        : 86;

    const serieEngajamento = [
      { label: '20 set', valor: 51 },
      { label: '27 set', valor: 63 },
      { label: '04 out', valor: 72 },
      { label: '11 out', valor: 74 },
      { label: '18 out', valor: 84 }
    ];

    return res.json({
      ok: true,
      isDemo: true,
      filtros: { unidade_id: Number(unidade_id), periodo, setor, equipe },
      resumoCards: {
        acoesConcluidas: Math.max(8, Math.round(38 * fatorPeriodo)),
        treinamentosRealizados: Math.max(6, Math.round(24 * fatorPeriodo)),
        rotinasEmDiaPct: setor === 'Todos' ? 86 : mediaRotinas
      },
      serieEngajamento,
      panoramaPorSetor: panoramaFiltrado
    });
  } catch (error) {
    console.error('[GET /api/app/reports]', error.message);
    return res.status(500).json({ ok: false, error: 'Erro ao gerar relatório demonstrativo.' });
  }
});

/**
 * GET /api/app/action-plans
 * Lista os planos de ação vinculados às avaliações de ambiente e indicadores.
 */
router.get('/action-plans', async (req, res) => {
  const { unidade_id = 1, setor = 'Todos', status = 'Todos' } = req.query;

  const planos = initialDemoStore.planosAcao.filter((p) => {
    if (Number(unidade_id) && p.unidade_id !== Number(unidade_id)) return false;
    if (setor !== 'Todos' && p.setor.toLowerCase() !== String(setor).toLowerCase()) return false;
    if (status !== 'Todos' && p.status.toLowerCase() !== String(status).toLowerCase()) return false;
    return true;
  });

  return res.json({
    ok: true,
    isDemo: true,
    avaliacoes: initialDemoStore.avaliacoes,
    planosAcao: planos
  });
});

/**
 * PATCH /api/app/action-plans/:id
 * Atualiza status, etapa atual e notas de acompanhamento de um plano de ação no protótipo.
 */
router.patch('/action-plans/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, etapa_atual, notas_acompanhamento } = req.body || {};

    const plano = initialDemoStore.planosAcao.find((p) => p.id === id);
    if (!plano) {
      return res.status(404).json({ ok: false, error: 'Plano de ação demonstrativo não encontrado.' });
    }

    if (status && ['Não iniciado', 'Em andamento', 'Em validação', 'Concluído'].includes(status)) {
      plano.status = status;
    }
    if (typeof etapa_atual === 'string' && etapa_atual.trim()) {
      plano.etapa_atual = etapa_atual.trim().slice(0, 140);
    }
    if (typeof notas_acompanhamento === 'string' && notas_acompanhamento.trim()) {
      plano.notas_acompanhamento = notas_acompanhamento.trim().slice(0, 800);
    }

    const mysqlOnline = await checkDatabaseConnection();
    if (mysqlOnline) {
      await executeQuery(
        'UPDATE planos_acao SET status = ?, etapa_atual = ?, notas_acompanhamento = ? WHERE id = ?',
        [plano.status, plano.etapa_atual, plano.notas_acompanhamento, id]
      );
    }

    return res.json({
      ok: true,
      isDemo: true,
      plano
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Erro ao atualizar plano de ação.' });
  }
});

/**
 * POST /api/app/action-plans
 * Cria um novo plano de ação demonstrativo vinculado a uma avaliação/indicador.
 */
router.post('/action-plans', requireRole(['consultora', 'gestor_unidade']), async (req, res) => {
  try {
    const {
      setor = 'Padaria',
      titulo,
      objetivo,
      indicador_vinculado = 'Rotinas em dia',
      etapa_atual = 'Alinhamento inicial com liderança',
      responsavel_nome = 'Encarregado(a) do Setor (Demo)',
      prazo = '2026-11-10',
      prioridade = 'Média'
    } = req.body || {};

    if (!titulo || String(titulo).trim().length < 5) {
      return res.status(400).json({
        ok: false,
        error: 'Informe um título claro para o plano de ação (mínimo de 5 caracteres).'
      });
    }

    const novoPlano = {
      id: initialDemoStore.planosAcao.length + 1,
      codigo: `PA-2026-0${initialDemoStore.planosAcao.length + 1}`,
      unidade_id: 1,
      departamento_id: 2,
      setor,
      avaliacao_id: 1,
      avaliacao_codigo: 'AVL-2026-01 (Avaliação de Ambiente)',
      titulo: String(titulo).trim(),
      objetivo: String(objetivo || 'Apoiar a padronização de rotina e engajamento da equipe do setor.').trim(),
      indicador_vinculado,
      etapa_atual,
      responsavel_nome,
      prazo,
      prioridade,
      status: 'Não iniciado',
      notas_acompanhamento: 'Plano de ação demonstrativo criado durante a navegação no protótipo.',
      is_demo: 1
    };

    initialDemoStore.planosAcao.unshift(novoPlano);

    return res.status(201).json({
      ok: true,
      isDemo: true,
      plano: novoPlano
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Erro ao criar plano de ação demonstrativo.' });
  }
});

module.exports = router;
