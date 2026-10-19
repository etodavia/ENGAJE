import React, { useState, useEffect, useCallback } from 'react';
import {
  Home,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  Target,
  LogOut,
  Search,
  Plus,
  Check,
  Clock,
  Calendar,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Headphones,
  Info,
  Shield,
  Users,
  FileText,
  Download,
  Bell,
  HelpCircle,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function AppPrototype({ initialScreen = 'visao-geral', onBackToSite }) {
  const [authenticated, setAuthenticated] = useState(initialScreen !== 'login');
  const [activeTab, setActiveTab] = useState(
    initialScreen === 'login' ? 'visao-geral' : initialScreen
  );

  // Perfil e filtros globais de demonstração
  const [currentUser, setCurrentUser] = useState({
    nome: 'Dra. Thaís',
    iniciais: 'DT',
    cargo: 'Consultora',
    perfil: 'consultora',
    email: 'thais.demo@engajesolucoes.com.br'
  });

  const [unidadeId, setUnidadeId] = useState(1);
  const [periodoGlobal, setPeriodoGlobal] = useState('30d');
  const [deptGlobal, setDeptGlobal] = useState('todos');

  // Estados do formulário de Login (Tela 1)
  const [loginEmail, setLoginEmail] = useState('thais.demo@engajesolucoes.com.br');
  const [loginSenha, setLoginSenha] = useState('engaje2026');
  const [loginPerfil, setLoginPerfil] = useState('consultora');
  const [lembrarMe, setLembrarMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Estados das telas internas carregados da API Express
  const [dashboardData, setDashboardData] = useState(null);
  const [trainingsData, setTrainingsData] = useState({
    treinamentos: [],
    evolucaoPorSetor: [],
    proximosEncontros: []
  });
  const [routinesData, setRoutinesData] = useState({
    rotinas: [],
    resumoPorSetor: []
  });
  const [reportsData, setReportsData] = useState(null);
  const [actionPlansData, setActionPlansData] = useState({
    avaliacoes: [],
    planosAcao: []
  });

  // Filtros locais de Treinamentos (Tela 3)
  const [trnSetor, setTrnSetor] = useState('Todos');
  const [trnPublico, setTrnPublico] = useState('Todos');
  const [trnStatus, setTrnStatus] = useState('Todos');
  const [trnBusca, setTrnBusca] = useState('');
  const [newTrainingModal, setNewTrainingModal] = useState(false);
  const [newTrnForm, setNewTrnForm] = useState({
    titulo: '',
    eixo_tematico: 'Segurança e manipulação de alimentos',
    setor: 'Açougue',
    publico: 'Equipe',
    proxima_atividade: '30 Abr · 14:00 – 16:00 · Online'
  });

  // Filtros locais de Rotinas Operacionais (Tela 4)
  const [rotSetor, setRotSetor] = useState('Padaria');
  const [rotTurno, setRotTurno] = useState('Abertura (manhã)');
  const [rotStatus, setRotStatus] = useState('Todos');
  const [rotBusca, setRotBusca] = useState('');
  const [newRoutineModal, setNewRoutineModal] = useState(false);
  const [newRotForm, setNewRotForm] = useState({
    setor: 'Padaria',
    titulo: '',
    descricao_curta: '',
    turno: 'Abertura (manhã)',
    responsavel_nome: 'Padeiro(a)',
    observacoes: 'Padrão demonstrativo inserido no turno.'
  });

  // Filtros locais de Relatórios (Tela 5)
  const [repPeriodo, setRepPeriodo] = useState('30d');
  const [repSetor, setRepSetor] = useState('Todos');
  const [repEquipe, setRepEquipe] = useState('Todas');

  // Filtros e modal de Planos de Ação (Tela 6)
  const [paSetor, setPaSetor] = useState('Todos');
  const [paStatus, setPaStatus] = useState('Todos');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPlanModal, setNewPlanModal] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    setor: 'Padaria',
    titulo: '',
    objetivo: '',
    indicador_vinculado: 'Rotinas em dia',
    responsavel_nome: 'Fernanda Rocha (Demo)',
    prazo: '2026-11-12',
    prioridade: 'Alta'
  });

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/app/dashboard?unidade_id=${unidadeId}&periodo=${periodoGlobal}&departamento=${deptGlobal}`,
        { headers: { 'x-engaje-role': currentUser.perfil } }
      );
      const data = await res.json();
      if (data.ok) setDashboardData(data);
    } catch (e) {
      console.error(e);
    }
  }, [unidadeId, periodoGlobal, deptGlobal, currentUser.perfil]);

  const loadTrainings = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        unidade_id: String(unidadeId),
        setor: trnSetor,
        publico: trnPublico,
        status: trnStatus,
        busca: trnBusca
      });
      const res = await fetch(`${API_BASE}/app/trainings?${params.toString()}`, {
        headers: { 'x-engaje-role': currentUser.perfil }
      });
      const data = await res.json();
      if (data.ok) setTrainingsData(data);
    } catch (e) {
      console.error(e);
    }
  }, [unidadeId, trnSetor, trnPublico, trnStatus, trnBusca, currentUser.perfil]);

  const loadRoutines = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        unidade_id: String(unidadeId),
        setor: rotSetor,
        turno: rotTurno === 'Todos' ? 'Todos' : rotTurno,
        status: rotStatus,
        busca: rotBusca
      });
      const res = await fetch(`${API_BASE}/app/routines?${params.toString()}`, {
        headers: { 'x-engaje-role': currentUser.perfil }
      });
      const data = await res.json();
      if (data.ok) setRoutinesData(data);
    } catch (e) {
      console.error(e);
    }
  }, [unidadeId, rotSetor, rotTurno, rotStatus, rotBusca, currentUser.perfil]);

  const loadReports = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        unidade_id: String(unidadeId),
        periodo: repPeriodo,
        setor: repSetor,
        equipe: repEquipe
      });
      const res = await fetch(`${API_BASE}/app/reports?${params.toString()}`, {
        headers: { 'x-engaje-role': currentUser.perfil }
      });
      const data = await res.json();
      if (data.ok) setReportsData(data);
    } catch (e) {
      console.error(e);
    }
  }, [unidadeId, repPeriodo, repSetor, repEquipe, currentUser.perfil]);

  const loadActionPlans = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        unidade_id: String(unidadeId),
        setor: paSetor,
        status: paStatus
      });
      const res = await fetch(`${API_BASE}/app/action-plans?${params.toString()}`, {
        headers: { 'x-engaje-role': currentUser.perfil }
      });
      const data = await res.json();
      if (data.ok) setActionPlansData(data);
    } catch (e) {
      console.error(e);
    }
  }, [unidadeId, paSetor, paStatus, currentUser.perfil]);

  useEffect(() => {
    if (authenticated) {
      loadDashboard();
      loadTrainings();
      loadRoutines();
      loadReports();
      loadActionPlans();
    }
  }, [
    authenticated,
    loadDashboard,
    loadTrainings,
    loadRoutines,
    loadReports,
    loadActionPlans
  ]);

  // Handler de Login do Protótipo
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(loginEmail.trim())) {
      setLoginError('Informe um endereço de e-mail válido para acessar a demonstração.');
      return;
    }
    if (!loginSenha || loginSenha.trim().length < 4) {
      setLoginError('Digite uma senha demonstrativa com pelo menos 4 caracteres.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/app/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          senha: loginSenha,
          perfil: loginPerfil,
          lembrar: lembrarMe
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.error || 'Verifique as credenciais de demonstração.');
        return;
      }

      const u = data.session.user;
      setCurrentUser({
        nome: u.nome,
        iniciais: u.iniciais || 'DT',
        cargo: u.cargo,
        perfil: u.perfil,
        email: u.email
      });
      setAuthenticated(true);
      setActiveTab('visao-geral');
      window.history.pushState({}, '', '/app');
    } catch (err) {
      setCurrentUser({
        nome: 'Dra. Thaís',
        iniciais: 'DT',
        cargo: 'Consultora (Demo)',
        perfil: loginPerfil,
        email: loginEmail
      });
      setAuthenticated(true);
      setActiveTab('visao-geral');
      window.history.pushState({}, '', '/app');
    }
  };

  // Alternar conclusão de uma rotina operacional
  const handleToggleRoutine = async (rotina) => {
    const novoStatus = rotina.status === 'Concluída' ? 'Pendente' : 'Concluída';
    try {
      await fetch(`${API_BASE}/app/routines/${rotina.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-engaje-role': currentUser.perfil
        },
        body: JSON.stringify({ status: novoStatus })
      });
      await loadRoutines();
      await loadDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  // Cadastrar nova rotina demonstrativa
  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    if (!newRotForm.titulo || newRotForm.titulo.trim().length < 4) return;
    await fetch(`${API_BASE}/app/routines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-engaje-role': currentUser.perfil
      },
      body: JSON.stringify(newRotForm)
    });
    setNewRoutineModal(false);
    setNewRotForm((prev) => ({ ...prev, titulo: '', descricao_curta: '' }));
    setRotSetor(newRotForm.setor);
    await loadRoutines();
    await loadDashboard();
  };

  // Cadastrar novo treinamento demonstrativo
  const handleCreateTraining = async (e) => {
    e.preventDefault();
    if (!newTrnForm.titulo || newTrnForm.titulo.trim().length < 4) return;
    await fetch(`${API_BASE}/app/trainings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-engaje-role': currentUser.perfil
      },
      body: JSON.stringify(newTrnForm)
    });
    setNewTrainingModal(false);
    setNewTrnForm((prev) => ({ ...prev, titulo: '' }));
    await loadTrainings();
    await loadDashboard();
  };

  // Alternar status rápido de treinamento
  const handleCycleTrainingStatus = async (trn) => {
    const ordem = ['Não iniciado', 'Em andamento', 'Concluído'];
    const prox = ordem[(ordem.indexOf(trn.status) + 1) % ordem.length];
    await fetch(`${API_BASE}/app/trainings/${trn.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-engaje-role': currentUser.perfil
      },
      body: JSON.stringify({ status: prox })
    });
    await loadTrainings();
    await loadDashboard();
  };

  // Atualizar Plano de Ação
  const handleUpdateActionPlan = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    await fetch(`${API_BASE}/app/action-plans/${selectedPlan.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-engaje-role': currentUser.perfil
      },
      body: JSON.stringify({
        status: selectedPlan.status,
        etapa_atual: selectedPlan.etapa_atual,
        notas_acompanhamento: selectedPlan.notas_acompanhamento
      })
    });
    setSelectedPlan(null);
    await loadActionPlans();
    await loadDashboard();
  };

  // Criar novo Plano de Ação demonstrativo
  const handleCreateActionPlan = async (e) => {
    e.preventDefault();
    if (!newPlanForm.titulo || newPlanForm.titulo.trim().length < 5) return;
    await fetch(`${API_BASE}/app/action-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-engaje-role': currentUser.perfil
      },
      body: JSON.stringify(newPlanForm)
    });
    setNewPlanModal(false);
    setNewPlanForm((prev) => ({ ...prev, titulo: '', objetivo: '' }));
    await loadActionPlans();
    await loadDashboard();
  };

  // Exportação real de CSV dos relatórios demonstrativos
  const handleExportReportCsv = () => {
    if (!reportsData?.panoramaPorSetor) return;
    const headers = [
      'Setor',
      'Plano de Acao (%)',
      'Capacitacao (%)',
      'Rotinas em Dia (%)',
      'Equipe Responsavel',
      'Natureza dos Dados'
    ];
    const rows = reportsData.panoramaPorSetor.map((item) => [
      item.setor,
      `${item.planoAcaoPct}%`,
      `${item.capacitacaoPct}%`,
      `${item.rotinasPct}%`,
      item.equipeResponsavel,
      'DADOS DEMONSTRATIVOS (PROTOTIPO)'
    ]);
    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-demonstrativo-engaje-${repPeriodo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ==========================================================================
  // TELA 1: LOGIN DO APP ENGAJE (Fiel à referência mobile e desktop)
  // ==========================================================================
  if (!authenticated) {
    return (
      <div className="app-login-page">
        <div className="app-login-split">
          <div className="app-login-hero-panel">
            {/* Marca d'água botânica discreta */}
            <svg
              className="botanical-watermark"
              viewBox="0 0 260 360"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M140 340C140 220 210 110 250 40C240 160 195 270 140 340Z"
                stroke="#DCE7DF"
                strokeWidth="4"
              />
              <path
                d="M140 340C135 235 65 150 15 110C30 215 80 295 140 340Z"
                stroke="#B99A5C"
                strokeWidth="3"
              />
            </svg>

            <h1 className="login-tagline-serif" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}>
              Cuidado que engaja.
              <span>Gestão que transforma.</span>
            </h1>

            <p
              style={{
                maxWidth: 400,
                color: 'rgba(244, 241, 233, 0.92)',
                fontSize: '1.08rem',
                lineHeight: 1.6,
                position: 'relative',
                zIndex: 2
              }}
            >
              Acompanhe equipes, rotinas e resultados da sua operação.
            </p>

            <div
              style={{
                marginTop: '2.2rem',
                padding: '0.6rem 1.1rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(10, 38, 25, 0.55)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(185, 154, 92, 0.55)',
                fontSize: '0.78rem',
                color: 'var(--color-gold-light)',
                position: 'relative',
                zIndex: 2
              }}
            >
              Protótipo Conceitual em Planejamento · Modo Demonstração
            </div>
          </div>

          <div className="login-form-panel">
            <div className="login-card-box">
              <div style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={onBackToSite}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-green-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={16} />
                  Voltar para a Landing Page
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <img
                  src="/assets/logo-engaje.png"
                  alt="Logo Engaje Soluções"
                  style={{
                    height: '58px',
                    width: 'auto',
                    objectFit: 'contain',
                    mixBlendMode: 'multiply',
                    margin: '0 auto 1rem'
                  }}
                />
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.1rem',
                    color: 'var(--color-green-primary)',
                    marginBottom: '0.25rem'
                  }}
                >
                  Acesse sua conta
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem' }}>
                  Bem-vinda ao App Engaje.
                </p>
              </div>

              {/* Nota explícita de protótipo conforme requisito */}
              <div
                style={{
                  backgroundColor: 'var(--color-green-light)',
                  border: '1px solid rgba(21, 59, 42, 0.18)',
                  borderRadius: '10px',
                  padding: '0.8rem 1rem',
                  marginBottom: '1.35rem',
                  fontSize: '0.82rem',
                  color: 'var(--color-green-primary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem'
                }}
              >
                <Info size={17} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Acesso em Modo Demo:</strong> O aplicativo está em planejamento. As
                  credenciais abaixo são demonstrativas para explorar o protótipo navegável.
                </div>
              </div>

              {loginError && (
                <div className="alert-banner error" role="alert">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="app-login-email">E-mail</label>
                  <div className="login-input-wrapper">
                    <Mail size={18} className="login-input-icon" />
                    <input
                      id="app-login-email"
                      type="email"
                      className="login-input"
                      placeholder="seuemail@empresa.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="app-login-password">Senha</label>
                  <div className="login-input-wrapper">
                    <Lock size={18} className="login-input-icon" />
                    <input
                      id="app-login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="login-input"
                      placeholder="Digite sua senha"
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="login-eye-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="app-login-perfil">Perfil de demonstração (RBAC)</label>
                  <select
                    id="app-login-perfil"
                    className="form-control"
                    value={loginPerfil}
                    onChange={(e) => {
                      const p = e.target.value;
                      setLoginPerfil(p);
                      if (p === 'consultora') setLoginEmail('thais.demo@engajesolucoes.com.br');
                      if (p === 'gestor_unidade') setLoginEmail('gestor.demo@valeverde.com.br');
                      if (p === 'lider_setor') setLoginEmail('lider.padaria.demo@valeverde.com.br');
                    }}
                  >
                    <option value="consultora">Dra. Thaís — Consultora Técnica (Acesso Completo)</option>
                    <option value="gestor_unidade">Roberto Mendes — Gerente de Loja (Demo)</option>
                    <option value="lider_setor">Fernanda Rocha — Líder de Padaria (Demo)</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '1.1rem 0 1.4rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={lembrarMe}
                      onChange={(e) => setLembrarMe(e.target.checked)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: 'var(--color-green-primary)'
                      }}
                    />
                    <span>Lembrar de mim (Manter conectado)</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="link-inline-button"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    borderRadius: '12px',
                    fontSize: '1.02rem'
                  }}
                >
                  <span>Entrar</span>
                  <ArrowRight size={18} />
                </button>
              </form>

              <div
                style={{
                  marginTop: '1.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  fontSize: '0.88rem',
                  color: 'var(--color-text-muted)'
                }}
              >
                <Headphones size={17} style={{ color: 'var(--color-gold)' }} />
                <span>Precisa de ajuda?</span>
                <a
                  href="https://wa.me/554799533709"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--color-green-primary)',
                    fontWeight: 700,
                    textDecoration: 'underline'
                  }}
                >
                  Fale com a Engaje.
                </a>
              </div>
            </div>
          </div>
        </div>

        {forgotModalOpen && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-panel">
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  color: 'var(--color-green-primary)',
                  marginBottom: '0.65rem'
                }}
              >
                Recuperação de senha (Modo Protótipo)
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', marginBottom: '1.2rem' }}>
                Este ambiente é uma <strong>demonstração navegável</strong> do App Engaje (em
                planejamento). Para acessar imediatamente o protótipo, basta clicar em{' '}
                <strong>Entrar</strong> com qualquer e-mail válido e senha de 4+ caracteres.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setForgotModalOpen(false)}
                style={{ width: '100%' }}
              >
                Voltar ao acesso demonstrativo
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Cálculo de progresso da tela de Rotinas
  const rotinasConcluidasSetor = routinesData.rotinas.filter(
    (r) => r.status === 'Concluída'
  ).length;
  const rotinasTotalSetor = routinesData.rotinas.length || 1;
  const rotinasPctSetor = Math.round((rotinasConcluidasSetor / rotinasTotalSetor) * 100);

  return (
    <div className="app-shell">
      {/* BARRA LATERAL FIXA NO DESKTOP EM VERDE ESCURO (#153B2A) */}
      <aside className="app-sidebar" aria-label="Menu principal do aplicativo Engaje">
        <div>
          <div className="app-sidebar-brand">
            <div
              style={{
                backgroundColor: 'var(--color-cream-bg)',
                padding: '0.55rem 0.9rem',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <img
                src="/assets/logo-engaje.png"
                alt="Logo Engaje Soluções"
                style={{
                  height: '42px',
                  width: 'auto',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply'
                }}
              />
            </div>
          </div>

          <nav className="app-sidebar-nav">
            <button
              type="button"
              className={`app-nav-item ${activeTab === 'visao-geral' ? 'active' : ''}`}
              onClick={() => setActiveTab('visao-geral')}
            >
              <Home size={19} />
              <span>Visão geral</span>
            </button>

            <button
              type="button"
              className={`app-nav-item ${activeTab === 'treinamentos' ? 'active' : ''}`}
              onClick={() => setActiveTab('treinamentos')}
            >
              <GraduationCap size={19} />
              <span>Treinamentos</span>
            </button>

            <button
              type="button"
              className={`app-nav-item ${activeTab === 'rotinas' ? 'active' : ''}`}
              onClick={() => setActiveTab('rotinas')}
            >
              <ClipboardCheck size={19} />
              <span>Rotinas</span>
            </button>

            <button
              type="button"
              className={`app-nav-item ${activeTab === 'planos-acao' ? 'active' : ''}`}
              onClick={() => setActiveTab('planos-acao')}
            >
              <Target size={19} />
              <span>Planos de ação</span>
            </button>

            <button
              type="button"
              className={`app-nav-item ${activeTab === 'relatorios' ? 'active' : ''}`}
              onClick={() => setActiveTab('relatorios')}
            >
              <BarChart3 size={19} />
              <span>Relatórios</span>
            </button>
          </nav>
        </div>

        <div className="app-sidebar-footer">
          <div className="app-user-badge">
            <div className="app-avatar-circle">{currentUser.iniciais}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <strong
                style={{
                  display: 'block',
                  fontSize: '0.86rem',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {currentUser.nome}
              </strong>
              <span style={{ fontSize: '0.73rem', color: 'rgba(244,241,233,0.72)' }}>
                {currentUser.cargo}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              className="app-nav-item"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.82rem', justifyContent: 'center' }}
            >
              <HelpCircle size={16} />
              <span>Ajuda</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthenticated(false)}
              className="app-nav-item"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.82rem', justifyContent: 'center' }}
              title="Voltar para a tela de Login do App"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToSite}
            style={{
              background: 'rgba(220,231,223,0.1)',
              border: '1px solid rgba(220,231,223,0.22)',
              color: 'var(--color-cream-bg)',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={14} />
            Voltar ao site institucional
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL EM CREME CLARO (#F4F1E9) */}
      <div className="app-main-area">
        {/* Barra Superior Global */}
        <header className="app-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="prototype-ribbon">
              <Info size={14} />
              Protótipo Conceitual em Planejamento · Dados Demonstrativos
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              aria-label="Selecionar empresa ou unidade demonstrativa"
              className="app-select"
              value={unidadeId}
              onChange={(e) => setUnidadeId(Number(e.target.value))}
              style={{ padding: '0.45rem 0.8rem', fontSize: '0.84rem' }}
            >
              <option value={1}>Supermercado Vale Verde — Matriz (Demo)</option>
              <option value={2}>Mercado Campo Belo — Filial Centro (Demo)</option>
            </select>

            <button
              type="button"
              onClick={() => setAuthenticated(false)}
              className="btn btn-outline"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
            >
              Tela de Login
            </button>
          </div>
        </header>

        <main className="app-content-canvas">
          {/* =================================================================
              TELA 2: DASHBOARD — VISÃO GERAL
             ================================================================= */}
          {activeTab === 'visao-geral' && dashboardData && (
            <section aria-labelledby="dash-title">
              <div className="app-page-header">
                <div>
                  <div className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                    <span>ACOMPANHAMENTO CONSOLIDADO · MODO DEMONSTRAÇÃO</span>
                  </div>
                  <h1 id="dash-title" className="app-page-title">
                    Visão geral da operação
                  </h1>
                  <p className="app-page-subtitle">
                    Indicadores demonstrativos de equipes, líderes, rotinas e planos de ação.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <select
                    aria-label="Filtrar período do dashboard"
                    className="app-select"
                    value={periodoGlobal}
                    onChange={(e) => setPeriodoGlobal(e.target.value)}
                  >
                    <option value="7d">Últimos 7 dias (Demo)</option>
                    <option value="30d">Últimos 30 dias (Demo)</option>
                    <option value="90d">Últimos 90 dias (Demo)</option>
                  </select>

                  <select
                    aria-label="Filtrar departamento do dashboard"
                    className="app-select"
                    value={deptGlobal}
                    onChange={(e) => setDeptGlobal(e.target.value)}
                  >
                    <option value="todos">Todos os departamentos</option>
                    <option value="hortifruti">Hortifruti</option>
                    <option value="acougue">Açougue</option>
                    <option value="padaria">Padaria</option>
                    <option value="mercearia">Mercearia</option>
                    <option value="frente-de-caixa">Frente de caixa</option>
                  </select>
                </div>
              </div>

              {/* 4 KPIs Consolidados */}
              <div className="app-kpi-grid">
                <div className="app-card app-kpi-card">
                  <div className="app-kpi-icon">
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                      Índice de engajamento
                    </span>
                    <div className="app-kpi-value">{dashboardData.kpis.indiceEngajamento}%</div>
                    <div className="app-kpi-gold-bar" />
                  </div>
                </div>

                <div className="app-card app-kpi-card">
                  <div className="app-kpi-icon">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                      Treinamentos concluídos
                    </span>
                    <div className="app-kpi-value">
                      {dashboardData.kpis.treinamentosConcluidosPct}%
                    </div>
                    <div className="app-kpi-gold-bar" />
                  </div>
                </div>

                <div className="app-card app-kpi-card">
                  <div className="app-kpi-icon">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                      Rotinas em dia
                    </span>
                    <div className="app-kpi-value">{dashboardData.kpis.rotinasEmDiaPct}%</div>
                    <div className="app-kpi-gold-bar" />
                  </div>
                </div>

                <div className="app-card app-kpi-card">
                  <div className="app-kpi-icon">
                    <Target size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                      Planos de ação ativos
                    </span>
                    <div className="app-kpi-value">{dashboardData.kpis.planosAcaoAtivos}</div>
                    <div className="app-kpi-gold-bar" />
                  </div>
                </div>
              </div>

              {/* Visão resumida por departamento/setor */}
              <div className="app-table-container">
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.35rem',
                      color: 'var(--color-green-primary)'
                    }}
                  >
                    Visão resumida por departamento / setor
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Dados demonstrativos para fins visuais
                  </span>
                </div>

                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Departamento</th>
                      <th>Liderança Responsável</th>
                      <th>Progresso Geral</th>
                      <th>Rotinas em Dia</th>
                      <th>Ponto de Atenção / Acompanhamento</th>
                      <th>Sinalização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.departamentosResumo.map((dept) => (
                      <tr key={dept.id}>
                        <td>
                          <strong>{dept.nome}</strong>
                        </td>
                        <td>{dept.responsavel_nome}</td>
                        <td>
                          <div className="progress-inline-wrap">
                            <strong style={{ fontSize: '0.82rem' }}>{dept.progresso_atual}%</strong>
                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{ width: `${dept.progresso_atual}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>{dept.rotinas_em_dia_pct}%</td>
                        <td style={{ maxWidth: 320, fontSize: '0.86rem' }}>
                          {dept.pontos_atencao}
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              dept.status_sinalizacao === 'estavel'
                                ? 'concluido'
                                : dept.status_sinalizacao === 'atencao'
                                ? 'andamento'
                                : 'agendado'
                            }`}
                          >
                            {dept.status_sinalizacao === 'estavel'
                              ? 'Consolidado'
                              : dept.status_sinalizacao === 'atencao'
                              ? 'Requer atenção'
                              : 'Em evolução'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comparativo de Equipes/Líderes + Próximos Passos Prioritários */}
              <div className="app-two-col-bottom">
                <div className="app-card">
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.3rem',
                      color: 'var(--color-green-primary)',
                      marginBottom: '1rem'
                    }}
                  >
                    Comparativo de equipes e lideranças
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {dashboardData.equipesComparativo.map((eq) => (
                      <div
                        key={eq.id}
                        style={{
                          padding: '0.95rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'var(--color-white)',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.4rem'
                          }}
                        >
                          <strong>
                            {eq.nome} · <span style={{ fontWeight: 500 }}>{eq.lider_nome}</span>
                          </strong>
                          <span
                            className={`status-pill ${
                              eq.status_comparativo === 'destaque'
                                ? 'concluido'
                                : eq.status_comparativo === 'acompanhar'
                                ? 'andamento'
                                : 'agendado'
                            }`}
                          >
                            {eq.status_comparativo === 'destaque'
                              ? 'Avanço consistente'
                              : eq.status_comparativo === 'acompanhar'
                              ? 'Acompanhar de perto'
                              : 'Ritmo regular'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--color-success-text)' }}>
                          <strong>Avanço:</strong> {eq.avanco_destaque}
                        </p>
                        <p
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--color-text-muted)',
                            marginTop: '0.2rem'
                          }}
                        >
                          <strong>Acompanhamento:</strong> {eq.item_acompanhamento}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="app-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.3rem',
                        color: 'var(--color-green-primary)'
                      }}
                    >
                      Ações prioritárias e próximos passos
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('planos-acao')}
                      className="link-inline-button"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Ver planos →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {dashboardData.acoesPrioritarias.map((acao) => (
                      <div
                        key={acao.id}
                        style={{
                          padding: '0.95rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'var(--color-white)',
                          border: '1px solid var(--color-border)',
                          borderLeft: '3px solid var(--color-gold)'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.78rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '0.25rem'
                          }}
                        >
                          <span>
                            {acao.setor} · Prazo: {acao.prazo}
                          </span>
                          <strong>{acao.status}</strong>
                        </div>
                        <strong style={{ display: 'block', fontSize: '0.92rem' }}>
                          {acao.titulo}
                        </strong>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          Responsável: {acao.responsavel_nome}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: '1.2rem',
                      textAlign: 'right',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-muted)'
                    }}
                  >
                    ⓘ Dados demonstrativos — Protótipo conceitual
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =================================================================
              TELA 3: TREINAMENTOS (Fiel à imagem de referência anexada)
             ================================================================= */}
          {activeTab === 'treinamentos' && (
            <section aria-labelledby="trn-title">
              <div className="app-page-header">
                <div>
                  <div className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                    <span>TREINAMENTO E DESENVOLVIMENTO</span>
                  </div>
                  <h1 id="trn-title" className="app-page-title">
                    Treinamentos
                  </h1>
                  <p className="app-page-subtitle">
                    Capacitação contínua para equipes e lideranças.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-gold-action"
                  onClick={() => setNewTrainingModal(true)}
                >
                  <Plus size={18} />
                  <span>Novo treinamento</span>
                </button>
              </div>

              {/* Barra de Filtros e Busca */}
              <div className="app-filters-bar">
                <select
                  aria-label="Filtrar treinamentos por setor"
                  className="app-select"
                  value={trnSetor}
                  onChange={(e) => setTrnSetor(e.target.value)}
                >
                  <option value="Todos">Todos os setores</option>
                  <option value="Açougue">Açougue</option>
                  <option value="Padaria">Padaria</option>
                  <option value="Hortifruti">Hortifruti</option>
                  <option value="Mercearia">Mercearia</option>
                  <option value="Frente de caixa">Frente de caixa</option>
                  <option value="Todos os setores">Todos os setores (Liderança)</option>
                </select>

                <select
                  aria-label="Filtrar treinamentos por público"
                  className="app-select"
                  value={trnPublico}
                  onChange={(e) => setTrnPublico(e.target.value)}
                >
                  <option value="Todos">Público: Todos</option>
                  <option value="Equipe">Equipe</option>
                  <option value="Líderes">Líderes</option>
                </select>

                <select
                  aria-label="Filtrar treinamentos por status"
                  className="app-select"
                  value={trnStatus}
                  onChange={(e) => setTrnStatus(e.target.value)}
                >
                  <option value="Todos">Status: Todos</option>
                  <option value="Não iniciado">Não iniciado (Agendado)</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluído">Concluído</option>
                </select>

                <div className="app-search-box">
                  <Search size={17} />
                  <input
                    type="search"
                    className="app-search-input"
                    placeholder="Buscar treinamento, trilha ou responsável..."
                    value={trnBusca}
                    onChange={(e) => setTrnBusca(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabela Principal de Treinamentos */}
              <div className="app-table-container">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Treinamento</th>
                      <th>Público</th>
                      <th>Setor</th>
                      <th>Responsável &amp; Próxima Atividade</th>
                      <th>Progresso</th>
                      <th>Status (Clique para alternar)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainingsData.treinamentos.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div className="solution-icon-box" style={{ width: 38, height: 38 }}>
                              {item.icone_tipo === 'shield' && <Shield size={18} />}
                              {item.icone_tipo === 'chart' && <BarChart3 size={18} />}
                              {item.icone_tipo === 'users' && <Users size={18} />}
                              {item.icone_tipo === 'document' && <FileText size={18} />}
                            </div>
                            <div>
                              <strong style={{ display: 'block', color: 'var(--color-green-primary)' }}>
                                {item.titulo}
                              </strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                Eixo: {item.eixo_tematico}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{item.publico}</td>
                        <td>{item.setor}</td>
                        <td>
                          <strong style={{ display: 'block', fontSize: '0.84rem' }}>
                            {item.responsavel_nome}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {item.proxima_atividade}
                          </span>
                        </td>
                        <td>
                          <div className="progress-inline-wrap">
                            <strong style={{ fontSize: '0.82rem' }}>
                              {item.progresso_percentual}%
                            </strong>
                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{ width: `${item.progresso_percentual}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleCycleTrainingStatus(item)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Clique para alternar o status no protótipo"
                          >
                            <span
                              className={`status-pill ${
                                item.status === 'Concluído'
                                  ? 'concluido'
                                  : item.status === 'Em andamento'
                                  ? 'andamento'
                                  : 'agendado'
                              }`}
                            >
                              {item.status === 'Concluído' && <CheckCircle2 size={14} />}
                              {item.status === 'Em andamento' && <Clock size={14} />}
                              {item.status === 'Não iniciado' && <Calendar size={14} />}
                              <span>{item.status}</span>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Linha Inferior: Próximos Encontros & Evolução por Setor */}
              <div className="app-two-col-bottom">
                <div className="app-card">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.15rem'
                    }}
                  >
                    <h2
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1.15rem',
                        color: 'var(--color-green-primary)'
                      }}
                    >
                      <Calendar size={19} style={{ color: 'var(--color-gold)' }} />
                      <span>Próximos encontros</span>
                    </h2>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                      Agenda demonstrativa
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {trainingsData.proximosEncontros.map((enc) => (
                      <div
                        key={enc.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          padding: '0.75rem 0.9rem',
                          borderRadius: '10px',
                          backgroundColor: 'var(--color-white)',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            style={{
                              width: 46,
                              height: 48,
                              borderRadius: '10px',
                              backgroundColor: 'var(--color-green-light)',
                              color: 'var(--color-green-primary)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1.1
                            }}
                          >
                            <strong style={{ fontSize: '1rem' }}>{enc.dia}</strong>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{enc.mes}</span>
                          </div>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.92rem' }}>
                              {enc.titulo}
                            </strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              {enc.publico} · {enc.setor}
                            </span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            {enc.horario}
                          </div>
                          <div>{enc.modalidade}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="app-card">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.15rem'
                    }}
                  >
                    <h2
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1.15rem',
                        color: 'var(--color-green-primary)'
                      }}
                    >
                      <BarChart3 size={19} style={{ color: 'var(--color-green-primary)' }} />
                      <span>Evolução por setor</span>
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Progresso médio
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                    {trainingsData.evolucaoPorSetor.map((ev) => (
                      <div
                        key={ev.setor}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 1fr 44px',
                          alignItems: 'center',
                          gap: '0.85rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        <span>{ev.setor}</span>
                        <div className="progress-track" style={{ height: 10 }}>
                          <div
                            className="progress-fill"
                            style={{ width: `${ev.progresso}%` }}
                          />
                        </div>
                        <strong style={{ textAlign: 'right' }}>{ev.progresso}%</strong>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: '1.35rem',
                      textAlign: 'right',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-muted)'
                    }}
                  >
                    ⓘ Dados demonstrativos
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =================================================================
              TELA 4: ROTINAS OPERACIONAIS (Fiel à imagem de referência anexada)
             ================================================================= */}
          {activeTab === 'rotinas' && (
            <section aria-labelledby="rot-title">
              <div className="app-page-header">
                <div>
                  <h1 id="rot-title" className="app-page-title">
                    Rotinas operacionais
                  </h1>
                  <p className="app-page-subtitle">
                    Padrões claros para uma execução consistente.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.9rem',
                      color: 'var(--color-green-primary)',
                      fontWeight: 500
                    }}
                  >
                    <Calendar size={17} />
                    Hoje, 18 de outubro (Demo)
                  </span>

                  <button
                    type="button"
                    className="btn-gold-action"
                    onClick={() => setNewRoutineModal(true)}
                  >
                    <Plus size={18} />
                    <span>Adicionar rotina</span>
                  </button>
                </div>
              </div>

              {/* Filtros de Setor, Turno, Status e Busca */}
              <div className="app-filters-bar">
                <select
                  aria-label="Filtrar rotinas por setor"
                  className="app-select"
                  value={rotSetor}
                  onChange={(e) => setRotSetor(e.target.value)}
                >
                  <option value="Padaria">Setor: Padaria</option>
                  <option value="Açougue">Setor: Açougue</option>
                  <option value="Hortifruti">Setor: Hortifruti</option>
                  <option value="Frente de caixa">Setor: Frente de caixa</option>
                  <option value="Todos">Todos os setores</option>
                </select>

                <select
                  aria-label="Filtrar rotinas por turno"
                  className="app-select"
                  value={rotTurno}
                  onChange={(e) => setRotTurno(e.target.value)}
                >
                  <option value="Todos">Turno: Todos</option>
                  <option value="Abertura (manhã)">Turno: Abertura (manhã)</option>
                  <option value="Tarde (operação)">Turno: Tarde (operação)</option>
                  <option value="Fechamento (noite)">Turno: Fechamento (noite)</option>
                </select>

                <select
                  aria-label="Filtrar pendências de rotinas"
                  className="app-select"
                  value={rotStatus}
                  onChange={(e) => setRotStatus(e.target.value)}
                >
                  <option value="Todos">Status: Todas as tarefas</option>
                  <option value="Pendente">Apenas Pendentes</option>
                  <option value="Concluída">Apenas Concluídas</option>
                </select>

                <div className="app-search-box">
                  <Search size={17} />
                  <input
                    type="search"
                    className="app-search-input"
                    placeholder="Buscar rotinas, setores ou tarefas..."
                    value={rotBusca}
                    onChange={(e) => setRotBusca(e.target.value)}
                  />
                </div>
              </div>

              <div className="routines-layout-grid">
                {/* Coluna Principal: Checklist Interativo */}
                <div className="app-table-container" style={{ marginBottom: 0 }}>
                  <div
                    style={{
                      padding: '1.35rem 1.5rem',
                      borderBottom: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.45rem',
                          color: 'var(--color-green-primary)'
                        }}
                      >
                        Rotinas do setor — {rotSetor}
                      </h2>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                        Checklist demonstrativo de rotinas operacionais (clique na caixa para concluir).
                      </p>
                    </div>

                    <div style={{ minWidth: 210 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem',
                          marginBottom: '0.35rem'
                        }}
                      >
                        <strong>
                          {rotinasConcluidasSetor} de {routinesData.rotinas.length} concluídas
                        </strong>
                        <span>{rotinasPctSetor}%</span>
                      </div>
                      <div className="progress-track" style={{ height: 9 }}>
                        <div
                          className="progress-fill"
                          style={{ width: `${rotinasPctSetor}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <table className="app-table">
                    <thead>
                      <tr>
                        <th style={{ width: 70 }}>#</th>
                        <th>Tarefa &amp; Frequência</th>
                        <th>Responsável</th>
                        <th>Status</th>
                        <th>Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routinesData.rotinas.map((rot, idx) => {
                        const isChecked = rot.status === 'Concluída';
                        return (
                          <tr key={rot.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.84rem' }}>
                                  {idx + 1}
                                </span>
                                <button
                                  type="button"
                                  className={`routine-checkbox-btn ${isChecked ? 'checked' : ''}`}
                                  onClick={() => handleToggleRoutine(rot)}
                                  aria-label={
                                    isChecked
                                      ? `Desmarcar tarefa ${rot.titulo}`
                                      : `Marcar tarefa ${rot.titulo} como concluída`
                                  }
                                >
                                  {isChecked && <Check size={15} strokeWidth={3} />}
                                </button>
                              </div>
                            </td>
                            <td>
                              <strong
                                style={{
                                  display: 'block',
                                  color: 'var(--color-green-primary)',
                                  textDecoration: isChecked ? ' none' : 'none'
                                }}
                              >
                                {rot.titulo}
                              </strong>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '0.83rem',
                                  color: 'var(--color-text-body)'
                                }}
                              >
                                {rot.descricao_curta}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--color-gold)',
                                  fontWeight: 600
                                }}
                              >
                                {rot.frequencia_prazo} · {rot.turno}
                              </span>
                            </td>
                            <td>{rot.responsavel_nome}</td>
                            <td>
                              <span
                                className={`status-pill ${
                                  isChecked ? 'concluido' : 'andamento'
                                }`}
                              >
                                {isChecked ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                <span>{rot.status}</span>
                              </span>
                            </td>
                            <td style={{ fontSize: '0.84rem', color: 'var(--color-text-body)' }}>
                              {rot.observacoes}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Coluna Direita: Rotinas por Setor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div className="app-card">
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.22rem',
                        color: 'var(--color-green-primary)',
                        marginBottom: '0.9rem'
                      }}
                    >
                      Rotinas por setor
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {routinesData.resumoPorSetor.map((item) => (
                        <button
                          key={item.setor}
                          type="button"
                          className={`sector-side-item ${
                            rotSetor === item.setor ? 'active' : ''
                          }`}
                          onClick={() => {
                            setRotSetor(item.setor);
                            setRotTurno('Todos');
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <strong
                              style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                color: 'var(--color-green-primary)'
                              }}
                            >
                              {item.setor}
                            </strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                              {item.concluidas} de {item.total} concluídas
                            </span>
                            <div className="progress-track" style={{ marginTop: '0.4rem', height: 6 }}>
                              <div
                                className="progress-fill"
                                style={{ width: `${item.percentual}%` }}
                              />
                            </div>
                          </div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--color-green-primary)' }}>
                            {item.percentual}%
                          </strong>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    className="app-card"
                    style={{
                      backgroundColor: 'var(--color-green-light)',
                      borderColor: 'rgba(21,59,42,0.18)'
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        color: 'var(--color-green-primary)',
                        marginBottom: '0.3rem'
                      }}
                    >
                      Rotinas padronizadas (Demo)
                    </strong>
                    <p style={{ fontSize: '0.83rem', color: 'var(--color-text-body)' }}>
                      Exemplos demonstrativos para supermercado e hortifrúti. Não substituem os
                      POPs e procedimentos técnicos oficiais de cada empresa.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =================================================================
              TELA 5: RELATÓRIOS (Fiel à imagem de referência anexada)
             ================================================================= */}
          {activeTab === 'relatorios' && reportsData && (
            <section aria-labelledby="rep-title">
              <div className="app-page-header">
                <div>
                  <h1 id="rep-title" className="app-page-title">
                    Relatórios
                  </h1>
                  <p className="app-page-subtitle">
                    Indicadores para orientar decisões e próximos passos.
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <select
                    aria-label="Período do relatório"
                    className="app-select"
                    value={repPeriodo}
                    onChange={(e) => setRepPeriodo(e.target.value)}
                  >
                    <option value="7d">Período: Últimos 7 dias</option>
                    <option value="30d">Período: Últimos 30 dias</option>
                    <option value="90d">Período: Últimos 90 dias</option>
                  </select>

                  <select
                    aria-label="Setor do relatório"
                    className="app-select"
                    value={repSetor}
                    onChange={(e) => setRepSetor(e.target.value)}
                  >
                    <option value="Todos">Setor: Todos</option>
                    <option value="Açougue">Açougue</option>
                    <option value="Padaria">Padaria</option>
                    <option value="Hortifruti">Hortifruti</option>
                    <option value="Frente de caixa">Frente de caixa</option>
                  </select>

                  <select
                    aria-label="Equipe do relatório"
                    className="app-select"
                    value={repEquipe}
                    onChange={(e) => setRepEquipe(e.target.value)}
                  >
                    <option value="Todas">Equipe: Todas</option>
                    <option value="Equipe Açougue & Desossa">Equipe Açougue &amp; Desossa</option>
                    <option value="Equipe Padaria & Confeitaria">Equipe Padaria &amp; Confeitaria</option>
                    <option value="Equipe Hortifrúti Abertura">Equipe Hortifrúti Abertura</option>
                    <option value="Equipe Atendimento & Checkouts">Equipe Atendimento &amp; Checkouts</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleExportReportCsv}
                    className="btn btn-outline"
                    style={{ padding: '0.62rem 1rem', fontSize: '0.86rem' }}
                  >
                    <Download size={16} />
                    Exportar CSV (Demo)
                  </button>
                </div>
              </div>

              {/* 3 Cartões Superiores conforme referência */}
              <div className="app-kpi-grid-3">
                <div className="app-card app-kpi-card">
                  <div className="app-kpi-icon">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
                      Ações concluídas
                    </span>
                    <div className="app-kpi-value">{reportsData.resumoCards.acoesConcluidas}</div>
                    <div className="app-kpi-gold-bar" />
                  </div>
                </div>

                <div className="app-card app-kpi-card">
                  <div className="app-kpi-icon">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
                      Treinamentos
                    </span>
                    <div className="app-kpi-value">
                      {reportsData.resumoCards.treinamentosRealizados}
                    </div>
                    <div className="app-kpi-gold-bar" />
                  </div>
                </div>

                <div className="app-card app-kpi-card">
                  <div className="app-kpi-icon">
                    <FileText size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
                      Rotinas em dia
                    </span>
                    <div className="app-kpi-value">{reportsData.resumoCards.rotinasEmDiaPct}%</div>
                    <div className="app-kpi-gold-bar" />
                  </div>
                </div>
              </div>

              {/* Gráfico de Linha/Área: Evolução do engajamento */}
              <div className="app-card" style={{ marginBottom: '1.65rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.4rem',
                      color: 'var(--color-green-primary)'
                    }}
                  >
                    Evolução do engajamento
                  </h2>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.84rem',
                      color: 'var(--color-green-primary)',
                      fontWeight: 600
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-green-primary)'
                      }}
                    />
                    Índice de engajamento (Dados demonstrativos)
                  </span>
                </div>

                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <svg
                    viewBox="0 0 820 210"
                    style={{ width: '100%', height: 'auto', minWidth: 520 }}
                    role="img"
                    aria-label="Gráfico demonstrativo de evolução do índice de engajamento de 51% a 84%"
                  >
                    <defs>
                      <linearGradient id="engajeChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#153B2A" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#153B2A" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Linhas horizontais de grade */}
                    {[0, 25, 50, 75, 100].map((val, idx) => {
                      const y = 170 - (val / 100) * 140;
                      return (
                        <g key={val}>
                          <text x="12" y={y + 4} fill="#5C6F64" fontSize="11">
                            {val}
                          </text>
                          <line
                            x1="46"
                            y1={y}
                            x2="790"
                            y2={y}
                            stroke="rgba(21,59,42,0.1)"
                            strokeDasharray={ idx === 0 ? 'none' : '4 4' }
                          />
                        </g>
                      );
                    })}

                    {/* Área preenchida sob a curva */}
                    <path
                      d="M 55 98 C 140 88, 190 84, 238 81 C 320 75, 360 70, 422 69 C 510 68, 550 67, 606 66 C 690 60, 740 55, 785 52 L 785 170 L 55 170 Z"
                      fill="url(#engajeChartGrad)"
                    />

                    {/* Curva suave */}
                    <path
                      d="M 55 98 C 140 88, 190 84, 238 81 C 320 75, 360 70, 422 69 C 510 68, 550 67, 606 66 C 690 60, 740 55, 785 52"
                      fill="none"
                      stroke="#153B2A"
                      strokeWidth="2.8"
                    />

                    {/* Pontos e rótulos do eixo X */}
                    {[
                      { x: 55, y: 98, label: '20 set', val: '51%' },
                      { x: 238, y: 81, label: '27 set', val: '63%' },
                      { x: 422, y: 69, label: '04 out', val: '72%' },
                      { x: 606, y: 66, label: '11 out', val: '74%' },
                      { x: 785, y: 52, label: '18 out', val: '84%' }
                    ].map((pt) => (
                      <g key={pt.label}>
                        <line
                          x1={pt.x}
                          y1={pt.y}
                          x2={pt.x}
                          y2="170"
                          stroke="rgba(21,59,42,0.1)"
                          strokeDasharray="3 3"
                        />
                        <circle cx={pt.x} cy={pt.y} r="5.5" fill="#153B2A" />
                        <text x={pt.x - 16} y="194" fill="#384B41" fontSize="12">
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Tabela: Panorama por setor */}
              <div className="app-table-container">
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.4rem',
                      color: 'var(--color-green-primary)'
                    }}
                  >
                    Panorama por setor
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Dados demonstrativos
                  </span>
                </div>

                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Setor</th>
                      <th>Plano de ação</th>
                      <th>Capacitação</th>
                      <th>Rotinas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportsData.panoramaPorSetor.map((row) => (
                      <tr key={row.setor}>
                        <td>
                          <strong>{row.setor}</strong>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.76rem',
                              color: 'var(--color-text-muted)'
                            }}
                          >
                            {row.equipeResponsavel}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <strong style={{ minWidth: 36 }}>{row.planoAcaoPct}%</strong>
                            <div className="progress-track" style={{ maxWidth: 160 }}>
                              <div
                                className="progress-fill"
                                style={{ width: `${row.planoAcaoPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <strong style={{ minWidth: 36 }}>{row.capacitacaoPct}%</strong>
                            <div className="progress-track" style={{ maxWidth: 160 }}>
                              <div
                                className="progress-fill"
                                style={{ width: `${row.capacitacaoPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <strong style={{ minWidth: 36 }}>{row.rotinasPct}%</strong>
                            <div className="progress-track" style={{ maxWidth: 160 }}>
                              <div
                                className="progress-fill"
                                style={{ width: `${row.rotinasPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* =================================================================
              TELA 6: PLANOS DE AÇÃO (Vinculados às Avaliações e Indicadores)
             ================================================================= */}
          {activeTab === 'planos-acao' && (
            <section aria-labelledby="pa-title">
              <div className="app-page-header">
                <div>
                  <div className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                    <span>ACOMPANHAMENTO TÉCNICO &amp; METAS</span>
                  </div>
                  <h1 id="pa-title" className="app-page-title">
                    Planos de ação
                  </h1>
                  <p className="app-page-subtitle">
                    Ações vinculadas às avaliações de ambiente e aos indicadores operacionais (Dados
                    de demonstração).
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-gold-action"
                  onClick={() => setNewPlanModal(true)}
                >
                  <Plus size={18} />
                  <span>Novo plano de ação</span>
                </button>
              </div>

              {/* Ciclos de Avaliação de Ambiente vinculados */}
              <div className="app-kpi-grid-3">
                {actionPlansData.avaliacoes.map((av) => (
                  <div key={av.id} className="app-card">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.76rem',
                        color: 'var(--color-gold)',
                        fontWeight: 700,
                        marginBottom: '0.3rem'
                      }}
                    >
                      <span>{av.codigo}</span>
                      <span>Setor: {av.setor}</span>
                    </div>
                    <strong
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.08rem',
                        color: 'var(--color-green-primary)',
                        marginBottom: '0.4rem'
                      }}
                    >
                      {av.ciclo}
                    </strong>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-body)' }}>
                      {av.resumo_tecnico}
                    </p>
                  </div>
                ))}
              </div>

              {/* Filtros de Planos de Ação */}
              <div className="app-filters-bar">
                <select
                  aria-label="Filtrar planos por setor"
                  className="app-select"
                  value={paSetor}
                  onChange={(e) => setPaSetor(e.target.value)}
                >
                  <option value="Todos">Todos os setores</option>
                  <option value="Padaria">Padaria</option>
                  <option value="Açougue">Açougue</option>
                  <option value="Hortifruti">Hortifruti</option>
                  <option value="Mercearia">Mercearia</option>
                  <option value="Frente de caixa">Frente de caixa</option>
                </select>

                <select
                  aria-label="Filtrar planos por status"
                  className="app-select"
                  value={paStatus}
                  onChange={(e) => setPaStatus(e.target.value)}
                >
                  <option value="Todos">Todos os status</option>
                  <option value="Não iniciado">Não iniciado</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Em validação">Em validação</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>

              {/* Tabela de Planos de Ação */}
              <div className="app-table-container">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Plano &amp; Objetivo</th>
                      <th>Avaliação / Indicador Vinculado</th>
                      <th>Etapa Atual</th>
                      <th>Responsável &amp; Prazo</th>
                      <th>Status</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actionPlansData.planosAcao.map((plano) => (
                      <tr key={plano.id}>
                        <td style={{ maxWidth: 290 }}>
                          <strong style={{ display: 'block', color: 'var(--color-green-primary)' }}>
                            {plano.titulo}
                          </strong>
                          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-body)' }}>
                            {plano.objetivo}
                          </span>
                        </td>
                        <td>
                          <strong style={{ display: 'block', fontSize: '0.83rem' }}>
                            {plano.indicador_vinculado}
                          </strong>
                          <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                            {plano.avaliacao_codigo}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.86rem' }}>{plano.etapa_atual}</td>
                        <td>
                          <strong style={{ display: 'block', fontSize: '0.86rem' }}>
                            {plano.responsavel_nome}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Prazo: {plano.prazo}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              plano.status === 'Concluído'
                                ? 'concluido'
                                : plano.status === 'Não iniciado'
                                ? 'agendado'
                                : 'andamento'
                            }`}
                          >
                            {plano.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                            onClick={() => setSelectedPlan({ ...plano })}
                          >
                            Detalhes / Atualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* NAVEGAÇÃO INFERIOR PARA TELAS ESTREITAS / MOBILE */}
      <nav className="app-mobile-bottom-nav" aria-label="Navegação móvel do aplicativo">
        <button
          type="button"
          className={`app-mobile-tab ${activeTab === 'visao-geral' ? 'active' : ''}`}
          onClick={() => setActiveTab('visao-geral')}
        >
          <Home size={18} />
          <span>Visão geral</span>
        </button>
        <button
          type="button"
          className={`app-mobile-tab ${activeTab === 'treinamentos' ? 'active' : ''}`}
          onClick={() => setActiveTab('treinamentos')}
        >
          <GraduationCap size={18} />
          <span>Treinamentos</span>
        </button>
        <button
          type="button"
          className={`app-mobile-tab ${activeTab === 'rotinas' ? 'active' : ''}`}
          onClick={() => setActiveTab('rotinas')}
        >
          <ClipboardCheck size={18} />
          <span>Rotinas</span>
        </button>
        <button
          type="button"
          className={`app-mobile-tab ${activeTab === 'planos-acao' ? 'active' : ''}`}
          onClick={() => setActiveTab('planos-acao')}
        >
          <Target size={18} />
          <span>Planos</span>
        </button>
        <button
          type="button"
          className={`app-mobile-tab ${activeTab === 'relatorios' ? 'active' : ''}`}
          onClick={() => setActiveTab('relatorios')}
        >
          <BarChart3 size={18} />
          <span>Relatórios</span>
        </button>
      </nav>

      {/* MODAL: DETALHES E ATUALIZAÇÃO DE PLANO DE AÇÃO */}
      {selectedPlan && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: 'var(--color-green-primary)'
                }}
              >
                Atualizar Plano de Ação (Protótipo)
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateActionPlan}>
              <p
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--color-green-primary)',
                  marginBottom: '0.4rem'
                }}
              >
                {selectedPlan.titulo}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-body)', marginBottom: '1rem' }}>
                <strong>Objetivo:</strong> {selectedPlan.objetivo}
              </p>

              <div className="form-group">
                <label htmlFor="pa-edit-status">Status do plano</label>
                <select
                  id="pa-edit-status"
                  className="form-control"
                  value={selectedPlan.status}
                  onChange={(e) =>
                    setSelectedPlan((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="Não iniciado">Não iniciado</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Em validação">Em validação</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pa-edit-etapa">Etapa atual</label>
                <input
                  id="pa-edit-etapa"
                  type="text"
                  className="form-control"
                  value={selectedPlan.etapa_atual}
                  onChange={(e) =>
                    setSelectedPlan((prev) => ({ ...prev, etapa_atual: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="pa-edit-notas">Notas de acompanhamento (Dados demonstrativos)</label>
                <textarea
                  id="pa-edit-notas"
                  rows={3}
                  className="form-control"
                  value={selectedPlan.notas_acompanhamento}
                  onChange={(e) =>
                    setSelectedPlan((prev) => ({
                      ...prev,
                      notas_acompanhamento: e.target.value
                    }))
                  }
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Salvar atualização no protótipo
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedPlan(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR NOVA ROTINA DEMONSTRATIVA */}
      {newRoutineModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: 'var(--color-green-primary)',
                marginBottom: '1rem'
              }}
            >
              Adicionar rotina demonstrativa
            </h3>
            <form onSubmit={handleCreateRoutine}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="nr-setor">Setor</label>
                  <select
                    id="nr-setor"
                    className="form-control"
                    value={newRotForm.setor}
                    onChange={(e) =>
                      setNewRotForm((prev) => ({ ...prev, setor: e.target.value }))
                    }
                  >
                    <option value="Padaria">Padaria</option>
                    <option value="Açougue">Açougue</option>
                    <option value="Hortifruti">Hortifruti</option>
                    <option value="Frente de caixa">Frente de caixa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="nr-turno">Turno</label>
                  <select
                    id="nr-turno"
                    className="form-control"
                    value={newRotForm.turno}
                    onChange={(e) =>
                      setNewRotForm((prev) => ({ ...prev, turno: e.target.value }))
                    }
                  >
                    <option value="Abertura (manhã)">Abertura (manhã)</option>
                    <option value="Tarde (operação)">Tarde (operação)</option>
                    <option value="Fechamento (noite)">Fechamento (noite)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="nr-titulo">Tarefa *</label>
                <input
                  id="nr-titulo"
                  type="text"
                  className="form-control"
                  placeholder="Ex.: Conferir higienização de fatiadores"
                  value={newRotForm.titulo}
                  onChange={(e) =>
                    setNewRotForm((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nr-desc">Orientação resumida</label>
                <input
                  id="nr-desc"
                  type="text"
                  className="form-control"
                  placeholder="Descrição objetiva da verificação..."
                  value={newRotForm.descricao_curta}
                  onChange={(e) =>
                    setNewRotForm((prev) => ({ ...prev, descricao_curta: e.target.value }))
                  }
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Adicionar ao checklist
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setNewRoutineModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO TREINAMENTO DEMONSTRATIVO */}
      {newTrainingModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: 'var(--color-green-primary)',
                marginBottom: '1rem'
              }}
            >
              Agendar trilha / treinamento (Demo)
            </h3>
            <form onSubmit={handleCreateTraining}>
              <div className="form-group">
                <label htmlFor="nt-titulo">Título da capacitação *</label>
                <input
                  id="nt-titulo"
                  type="text"
                  className="form-control"
                  placeholder="Ex.: Condutas sanitárias e recepção de perecíveis"
                  value={newTrnForm.titulo}
                  onChange={(e) =>
                    setNewTrnForm((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nt-eixo">Eixo temático</label>
                <select
                  id="nt-eixo"
                  className="form-control"
                  value={newTrnForm.eixo_tematico}
                  onChange={(e) =>
                    setNewTrnForm((prev) => ({ ...prev, eixo_tematico: e.target.value }))
                  }
                >
                  <option value="Segurança e manipulação de alimentos">
                    Segurança e manipulação de alimentos
                  </option>
                  <option value="Estrutura organizacional e funcional">
                    Estrutura organizacional e funcional
                  </option>
                  <option value="Condutas e normativas aplicáveis">
                    Condutas e normativas aplicáveis
                  </option>
                  <option value="Liderança e metas">Liderança e metas</option>
                  <option value="Venda analítica de alimentos">Venda analítica de alimentos</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="nt-setor">Setor</label>
                  <select
                    id="nt-setor"
                    className="form-control"
                    value={newTrnForm.setor}
                    onChange={(e) =>
                      setNewTrnForm((prev) => ({ ...prev, setor: e.target.value }))
                    }
                  >
                    <option value="Açougue">Açougue</option>
                    <option value="Padaria">Padaria</option>
                    <option value="Hortifruti">Hortifruti</option>
                    <option value="Mercearia">Mercearia</option>
                    <option value="Todos os setores">Todos os setores</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="nt-publico">Público</label>
                  <select
                    id="nt-publico"
                    className="form-control"
                    value={newTrnForm.publico}
                    onChange={(e) =>
                      setNewTrnForm((prev) => ({ ...prev, publico: e.target.value }))
                    }
                  >
                    <option value="Equipe">Equipe</option>
                    <option value="Líderes">Líderes</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Cadastrar treinamento demonstrativo
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setNewTrainingModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO PLANO DE AÇÃO DEMONSTRATIVO */}
      {newPlanModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: 'var(--color-green-primary)',
                marginBottom: '1rem'
              }}
            >
              Novo Plano de Ação (Demo)
            </h3>
            <form onSubmit={handleCreateActionPlan}>
              <div className="form-group">
                <label htmlFor="np-titulo">Título da ação *</label>
                <input
                  id="np-titulo"
                  type="text"
                  className="form-control"
                  placeholder="Ex.: Adequação da planilha de controle térmico noturno"
                  value={newPlanForm.titulo}
                  onChange={(e) =>
                    setNewPlanForm((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="np-objetivo">Objetivo técnico</label>
                <textarea
                  id="np-objetivo"
                  rows={2}
                  className="form-control"
                  placeholder="Descreva o objetivo vinculado à avaliação de ambiente..."
                  value={newPlanForm.objetivo}
                  onChange={(e) =>
                    setNewPlanForm((prev) => ({ ...prev, objetivo: e.target.value }))
                  }
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="np-setor">Departamento</label>
                  <select
                    id="np-setor"
                    className="form-control"
                    value={newPlanForm.setor}
                    onChange={(e) =>
                      setNewPlanForm((prev) => ({ ...prev, setor: e.target.value }))
                    }
                  >
                    <option value="Padaria">Padaria</option>
                    <option value="Açougue">Açougue</option>
                    <option value="Hortifruti">Hortifruti</option>
                    <option value="Mercearia">Mercearia</option>
                    <option value="Frente de caixa">Frente de caixa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="np-prazo">Prazo estimado</label>
                  <input
                    id="np-prazo"
                    type="date"
                    className="form-control"
                    value={newPlanForm.prazo}
                    onChange={(e) =>
                      setNewPlanForm((prev) => ({ ...prev, prazo: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Registrar plano demonstrativo
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setNewPlanModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE AJUDA / SOBRE O PROTÓTIPO */}
      {helpModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: 'var(--color-green-primary)',
                marginBottom: '0.75rem'
              }}
            >
              Sobre o Protótipo do App Engaje
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', marginBottom: '0.85rem' }}>
              Esta área é uma <strong>prévia conceitual e demonstrativa</strong> do aplicativo
              interno da Engaje Soluções, atualmente em fase de planejamento.
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', marginBottom: '1.25rem' }}>
              Todos os indicadores, nomes de unidades, colaboradores e rotinas exibidos são
              fictícios para demonstração de usabilidade (Desktop e Mobile) e não substituem
              procedimentos técnicos oficiais.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setHelpModalOpen(false)}
              style={{ width: '100%' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
