-- ============================================================================
-- ENGAJE SOLUÇÕES & CONSULTORIA
-- Script de Criação do Banco de Dados e Tabelas (MySQL 8.0+)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS engaje_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE engaje_db;

-- ----------------------------------------------------------------------------
-- 1. Tabela de Leads (Formulário de Contato da Landing Page)
-- Minimização de dados compatível com LGPD
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  empresa VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  telefone VARCHAR(40) NOT NULL,
  servico_interesse VARCHAR(100) NOT NULL,
  mensagem TEXT NOT NULL,
  consentimento TINYINT(1) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_leads_criado_em (criado_em),
  INDEX idx_leads_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Empresas / Unidades (Módulo App Engaje - Protótipo)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS empresas_unidades (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(140) NOT NULL,
  codigo_unidade VARCHAR(40) NOT NULL UNIQUE,
  cidade VARCHAR(80) NOT NULL,
  uf CHAR(2) NOT NULL,
  programa_ativo ENUM('Engajamento 360º', 'Engajamento Evolutivo', 'Engaja+') NOT NULL DEFAULT 'Engajamento 360º',
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Departamentos / Setores Operacionais
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departamentos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  unidade_id INT UNSIGNED NOT NULL,
  nome VARCHAR(80) NOT NULL,
  slug VARCHAR(60) NOT NULL,
  responsavel_nome VARCHAR(100) NOT NULL,
  progresso_atual TINYINT UNSIGNED NOT NULL DEFAULT 0,
  rotinas_em_dia_pct TINYINT UNSIGNED NOT NULL DEFAULT 0,
  treinamentos_concluidos_pct TINYINT UNSIGNED NOT NULL DEFAULT 0,
  pontos_atencao VARCHAR(255) NOT NULL,
  status_sinalizacao ENUM('estavel', 'atencao', 'evolucao') NOT NULL DEFAULT 'evolucao',
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_dept_unidade FOREIGN KEY (unidade_id) REFERENCES empresas_unidades(id) ON DELETE CASCADE,
  INDEX idx_dept_unidade (unidade_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Usuários (Acesso por Perfil / RBAC - Apenas dados demonstrativos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  unidade_id INT UNSIGNED NOT NULL,
  departamento_id INT UNSIGNED NULL,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil ENUM('consultora', 'gestor_unidade', 'lider_setor') NOT NULL DEFAULT 'gestor_unidade',
  cargo VARCHAR(100) NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_unidade FOREIGN KEY (unidade_id) REFERENCES empresas_unidades(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_dept FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Equipes e Lideranças Operacionais
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  unidade_id INT UNSIGNED NOT NULL,
  departamento_id INT UNSIGNED NOT NULL,
  nome VARCHAR(120) NOT NULL,
  lider_nome VARCHAR(120) NOT NULL,
  turno ENUM('Manhã', 'Tarde', 'Integral', 'Fechamento') NOT NULL DEFAULT 'Manhã',
  membros_count SMALLINT UNSIGNED NOT NULL DEFAULT 5,
  engajamento_score TINYINT UNSIGNED NOT NULL DEFAULT 75,
  rotinas_aderencia TINYINT UNSIGNED NOT NULL DEFAULT 80,
  avanco_destaque VARCHAR(220) NOT NULL,
  item_acompanhamento VARCHAR(220) NOT NULL,
  status_comparativo ENUM('destaque', 'regular', 'acompanhar') NOT NULL DEFAULT 'regular',
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_equipe_unidade FOREIGN KEY (unidade_id) REFERENCES empresas_unidades(id) ON DELETE CASCADE,
  CONSTRAINT fk_equipe_dept FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Catálogo de Treinamentos e Trilhas Técnicas
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS treinamentos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  titulo VARCHAR(160) NOT NULL,
  eixo_tematico ENUM(
    'Estrutura organizacional e funcional',
    'Condutas e normativas aplicáveis',
    'Liderança e metas',
    'Segurança e manipulação de alimentos',
    'Venda analítica de alimentos'
  ) NOT NULL,
  setor_alvo VARCHAR(80) NOT NULL,
  publico_alvo ENUM('Liderança', 'Operação', 'Equipe Multissetorial') NOT NULL,
  carga_horaria_horas DECIMAL(4,1) NOT NULL DEFAULT 2.0,
  formato VARCHAR(60) NOT NULL DEFAULT 'Híbrido (On-line + Prática)',
  descricao TEXT NOT NULL,
  is_demo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Matrículas / Acompanhamento de Treinamentos por Unidade e Setor
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matriculas_treinamento (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  treinamento_id INT UNSIGNED NOT NULL,
  unidade_id INT UNSIGNED NOT NULL,
  departamento_id INT UNSIGNED NOT NULL,
  responsavel_nome VARCHAR(120) NOT NULL,
  status ENUM('Não iniciado', 'Em andamento', 'Concluído') NOT NULL DEFAULT 'Não iniciado',
  progresso_percentual TINYINT UNSIGNED NOT NULL DEFAULT 0,
  participantes_concluidos SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  participantes_total SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  proxima_atividade VARCHAR(180) NOT NULL,
  prazo_estimado DATE NOT NULL,
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_mat_treinamento FOREIGN KEY (treinamento_id) REFERENCES treinamentos(id) ON DELETE CASCADE,
  CONSTRAINT fk_mat_unidade FOREIGN KEY (unidade_id) REFERENCES empresas_unidades(id) ON DELETE CASCADE,
  CONSTRAINT fk_mat_dept FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Rotinas Operacionais e Verificações Diárias
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rotinas_operacionais (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL,
  unidade_id INT UNSIGNED NOT NULL,
  departamento_id INT UNSIGNED NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  turno ENUM('Manhã', 'Tarde', 'Noite', 'Integral') NOT NULL DEFAULT 'Manhã',
  responsavel_nome VARCHAR(120) NOT NULL,
  frequencia_prazo VARCHAR(80) NOT NULL,
  status ENUM('Concluída', 'Pendente', 'Em verificação') NOT NULL DEFAULT 'Pendente',
  observacoes VARCHAR(255) NOT NULL,
  orientacao_demonstrativa TEXT NOT NULL,
  periodo_referencia ENUM('7d', '30d', '90d') NOT NULL DEFAULT '30d',
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rotina_unidade FOREIGN KEY (unidade_id) REFERENCES empresas_unidades(id) ON DELETE CASCADE,
  CONSTRAINT fk_rotina_dept FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE,
  INDEX idx_rotina_filtros (unidade_id, departamento_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. Histórico de Execuções de Rotinas
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS execucoes_rotina (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rotina_id INT UNSIGNED NOT NULL,
  executado_por VARCHAR(120) NOT NULL,
  status_registrado ENUM('Concluída', 'Pendente', 'Em verificação') NOT NULL,
  observacao VARCHAR(255) NULL,
  data_execucao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_exec_rotina FOREIGN KEY (rotina_id) REFERENCES rotinas_operacionais(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. Avaliações de Ambiente (Ciclos Diagnósticos Engaje)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS avaliacoes_ambiente (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  unidade_id INT UNSIGNED NOT NULL,
  departamento_id INT UNSIGNED NOT NULL,
  ciclo VARCHAR(60) NOT NULL,
  data_avaliacao DATE NOT NULL,
  indice_conformidade TINYINT UNSIGNED NOT NULL DEFAULT 75,
  eixo_critico VARCHAR(120) NOT NULL,
  resumo_tecnico TEXT NOT NULL,
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_aval_unidade FOREIGN KEY (unidade_id) REFERENCES empresas_unidades(id) ON DELETE CASCADE,
  CONSTRAINT fk_aval_dept FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. Planos de Ação (Vinculados às Avaliações e Indicadores)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planos_acao (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  unidade_id INT UNSIGNED NOT NULL,
  departamento_id INT UNSIGNED NOT NULL,
  avaliacao_id INT UNSIGNED NULL,
  titulo VARCHAR(160) NOT NULL,
  objetivo TEXT NOT NULL,
  indicador_vinculado VARCHAR(120) NOT NULL,
  etapa_atual VARCHAR(120) NOT NULL,
  responsavel_nome VARCHAR(120) NOT NULL,
  prazo DATE NOT NULL,
  prioridade ENUM('Alta', 'Média', 'Programada') NOT NULL DEFAULT 'Média',
  status ENUM('Não iniciado', 'Em andamento', 'Em validação', 'Concluído') NOT NULL DEFAULT 'Em andamento',
  notas_acompanhamento TEXT NOT NULL,
  is_demo TINYINT(1) NOT NULL DEFAULT 1,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_plano_unidade FOREIGN KEY (unidade_id) REFERENCES empresas_unidades(id) ON DELETE CASCADE,
  CONSTRAINT fk_plano_dept FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE,
  CONSTRAINT fk_plano_avaliacao FOREIGN KEY (avaliacao_id) REFERENCES avaliacoes_ambiente(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
