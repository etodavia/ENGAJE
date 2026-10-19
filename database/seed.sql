-- ============================================================================
-- ENGAJE SOLUÇÕES & CONSULTORIA
-- Script de Carga Inicial Demonstrativa (Seed - Dados de Demonstração)
-- Nota: Todos os registros deste arquivo são estritamente demonstrativos
-- (is_demo = 1) para navegação no protótipo conceitual do App Engaje.
-- ============================================================================

USE engaje_db;

-- Limpeza segura das tabelas demonstrativas na ordem de integridade
DELETE FROM execucoes_rotina WHERE is_demo = 1;
DELETE FROM rotinas_operacionais WHERE is_demo = 1;
DELETE FROM planos_acao WHERE is_demo = 1;
DELETE FROM avaliacoes_ambiente WHERE is_demo = 1;
DELETE FROM matriculas_treinamento WHERE is_demo = 1;
DELETE FROM treinamentos WHERE is_demo = 1;
DELETE FROM equipes WHERE is_demo = 1;
DELETE FROM usuarios WHERE is_demo = 1;
DELETE FROM departamentos WHERE is_demo = 1;
DELETE FROM empresas_unidades WHERE is_demo = 1;

-- 1. Empresas / Unidades (Dados Demonstrativos)
INSERT INTO empresas_unidades (id, nome, codigo_unidade, cidade, uf, programa_ativo, is_demo) VALUES
(1, 'Supermercado Vale Verde — Matriz (Demo)', 'VV-MATRIZ-01', 'Joinville', 'SC', 'Engaja+', 1),
(2, 'Hortifrúti & Mercado Campo Belo — Filial Centro (Demo)', 'CB-CENTRO-02', 'Jaraguá do Sul', 'SC', 'Engajamento Evolutivo', 1);

-- 2. Departamentos Operacionais
INSERT INTO departamentos (id, unidade_id, nome, slug, responsavel_nome, progresso_atual, rotinas_em_dia_pct, treinamentos_concluidos_pct, pontos_atencao, status_sinalizacao, is_demo) VALUES
(1, 1, 'Açougue', 'acougue', 'Carlos Eduardo M. (Demo)', 80, 80, 82, 'Reforçar registro de temperatura na troca de turno da tarde', 'evolucao', 1),
(2, 1, 'Padaria', 'padaria', 'Fernanda Rocha (Demo)', 74, 60, 100, 'Padronizar etiquetagem de fracionados e aferição de balcão térmico', 'atencao', 1),
(3, 1, 'Hortifruti', 'hortifruti', 'Marcos Vinícius S. (Demo)', 90, 100, 35, 'Manter triagem matinal de folhosos e higienização de gôndolas', 'estavel', 1),
(4, 1, 'Mercearia', 'mercearia', 'Juliana Alves (Demo)', 76, 78, 55, 'Auditoria preventiva PVPS em laticínios e perecíveis refrigerados', 'evolucao', 1),
(5, 1, 'Frente de caixa', 'frente-de-caixa', 'Patrícia Gomes (Demo)', 72, 67, 72, 'Higienização de esteiras e orientação sobre separação de itens químicos/alimentos', 'atencao', 1),
(6, 2, 'Hortifruti', 'hortifruti', 'Renato Lima (Demo)', 88, 92, 85, 'Controle de umidade na ilha de orgânicos e rastreabilidade', 'estavel', 1),
(7, 2, 'Padaria', 'padaria', 'Camila Borges (Demo)', 79, 82, 75, 'Organização de depósito de secos e planilha de higienização de fornos', 'evolucao', 1);

-- 3. Usuários Demonstrativos (Acesso por perfil no protótipo)
-- Nota: Senha de demonstração verificada em modo protótipo
INSERT INTO usuarios (id, unidade_id, departamento_id, nome, email, senha_hash, perfil, cargo, ativo, is_demo) VALUES
(1, 1, NULL, 'Dra. Thaís da Luz', 'thais.demo@engajesolucoes.com.br', 'DEMO_HASH_CONSULTORA', 'consultora', 'Consultora Técnica & Fundadora', 1, 1),
(2, 1, NULL, 'Roberto Mendes (Demo)', 'gestor.demo@valeverde.com.br', 'DEMO_HASH_GESTOR', 'gestor_unidade', 'Gerente Geral de Loja', 1, 1),
(3, 1, 2, 'Fernanda Rocha (Demo)', 'lider.padaria.demo@valeverde.com.br', 'DEMO_HASH_LIDER', 'lider_setor', 'Líder de Padaria e Confeitaria', 1, 1);

-- 4. Equipes e Lideranças
INSERT INTO equipes (id, unidade_id, departamento_id, nome, lider_nome, turno, membros_count, engajamento_score, rotinas_aderencia, avanco_destaque, item_acompanhamento, status_comparativo, is_demo) VALUES
(1, 1, 3, 'Equipe Hortifrúti Abertura', 'Marcos Vinícius S. (Demo)', 'Manhã', 8, 91, 95, '100% das rotinas de seleção e higienização entregues no horário na última semana', 'Conclusão da trilha de Organização Funcional do Setor', 'destaque', 1),
(2, 1, 1, 'Equipe Açougue & Desossa', 'Carlos Eduardo M. (Demo)', 'Integral', 10, 84, 82, 'Redução consistente de quebras por ajuste no padrão de recepção refrigerada', 'Calibração de termômetros de espeto e planilha de câmera fria no turno 2', 'regular', 1),
(3, 1, 2, 'Equipe Padaria & Confeitaria', 'Fernanda Rocha (Demo)', 'Manhã', 9, 76, 68, '100% da equipe concluiu o workshop de Venda Analítica de Alimentos', 'Regularizar checklist de abertura (etiquetagem de validade após fracionamento)', 'acompanhar', 1),
(4, 1, 4, 'Equipe Mercearia & Perecíveis', 'Juliana Alves (Demo)', 'Tarde', 12, 79, 78, 'Melhoria na organização de estoque intermediário e giro PVPS', 'Acompanhar participação no módulo de Condutas e Normativas Aplicáveis', 'regular', 1),
(5, 1, 5, 'Equipe Atendimento & Frente de Caixa', 'Patrícia Gomes (Demo)', 'Fechamento', 14, 73, 70, 'Engajamento positivo nas orientações de embalagem segura de perecíveis', 'Reforçar rotina diária de higienização dos checkouts entre turnos', 'acompanhar', 1);

-- 5. Catálogo de Treinamentos (Os 5 eixos solicitados)
INSERT INTO treinamentos (id, codigo, titulo, eixo_tematico, setor_alvo, publico_alvo, carga_horaria_horas, formato, descricao, is_demo) VALUES
(1, 'TRN-SEG-01', 'Boas práticas na manipulação de alimentos', 'Segurança e manipulação de alimentos', 'Açougue', 'Operação', 4.0, 'Presencial + Prática em Loja', 'Controle higiênico-sanitário, prevenção de contaminação cruzada, cadeia de frio e higienização correta de utensílios e superfícies.', 1),
(2, 'TRN-VEN-02', 'Venda analítica de alimentos e experiência sensorial', 'Venda analítica de alimentos', 'Padaria', 'Operação', 3.5, 'Workshop Sensorial', 'Atributos sensoriais dos alimentos, conservação da qualidade visual, abordagem consultiva ao cliente e valorização de produtos frescos.', 1),
(3, 'TRN-LID-03', 'Liderança próxima, gestão de rotina e metas', 'Liderança e metas', 'Todos os setores', 'Liderança', 4.0, 'Híbrido (On-line + Mentoria)', 'Desenvolvimento de encarregados de setor, condução de reuniões rápidas de turno, acompanhamento de indicadores e feedback construtivo.', 1),
(4, 'TRN-ORG-04', 'Organização funcional e estrutura do setor', 'Estrutura organizacional e funcional', 'Hortifruti', 'Operação', 3.0, 'On-line + Aplicação Guiada', 'Clareza de papéis, fluxo de abastecimento, organização de retaguarda, redução de retrabalho e prevenção de perdas operacionais.', 1),
(5, 'TRN-NOR-05', 'Condutas sanitárias e normativas aplicáveis (RDC 216 / POPs)', 'Condutas e normativas aplicáveis', 'Mercearia', 'Equipe Multissetorial', 3.0, 'On-line Interativo', 'Diretrizes da legislação sanitária vigente, preenchimento fidedigno de planilhas de controle, rastreabilidade e conduta pessoal.', 1),
(6, 'TRN-SEG-06', 'Prevenção de perdas e conservação na Frente de Caixa', 'Segurança e manipulação de alimentos', 'Frente de caixa', 'Operação', 2.0, 'On-line + Simulação', 'Cuidados no manuseio de congelados, resfriados, pães e hortifrúti no checkout para preservar a integridade e segurança do alimento.', 1);

-- 6. Matrículas / Acompanhamento de Treinamentos (Dados Demonstrativos)
INSERT INTO matriculas_treinamento (id, treinamento_id, unidade_id, departamento_id, responsavel_nome, status, progresso_percentual, participantes_concluidos, participantes_total, proxima_atividade, prazo_estimado, is_demo) VALUES
(1, 1, 1, 1, 'Carlos Eduardo M. (Demo)', 'Em andamento', 82, 8, 10, '29 Out · 15:00 — Prática supervisionada de recepção e desossa (Presencial)', '2026-10-29', 1),
(2, 2, 1, 2, 'Fernanda Rocha (Demo)', 'Concluído', 100, 9, 9, 'Ciclo concluído — Revisão de indicadores sensoriais em 15 dias', '2026-10-15', 1),
(3, 3, 1, 4, 'Dra. Thaís da Luz', 'Em andamento', 60, 6, 10, '22 Out · 09:00 — Encontro de alinhamento de líderes e metas (Presencial)', '2026-10-28', 1),
(4, 4, 1, 3, 'Marcos Vinícius S. (Demo)', 'Não iniciado', 35, 3, 8, '20 Out · 14:00 — Módulo 1: Fluxo de recepção e bancada (On-line)', '2026-11-05', 1),
(5, 5, 1, 4, 'Juliana Alves (Demo)', 'Em andamento', 55, 7, 12, '25 Out · 10:30 — Validação de registros de validade e PVPS (On-line)', '2026-11-02', 1),
(6, 6, 1, 5, 'Patrícia Gomes (Demo)', 'Em andamento', 72, 10, 14, '27 Out · 16:00 — Rodada prática de atendimento e conservação (Presencial)', '2026-10-30', 1),
(7, 4, 2, 6, 'Renato Lima (Demo)', 'Concluído', 100, 8, 8, 'Ciclo concluído — Monitoramento quinzenal ativo', '2026-10-10', 1),
(8, 1, 2, 7, 'Camila Borges (Demo)', 'Em andamento', 75, 6, 8, '24 Out · 14:00 — Verificação de POP de higienização de equipamentos', '2026-10-31', 1);

-- 7. Rotinas Operacionais (Exemplos para Padaria, Açougue, Hortifrúti, Mercearia e Frente de Caixa)
INSERT INTO rotinas_operacionais (id, codigo, unidade_id, departamento_id, titulo, turno, responsavel_nome, frequencia_prazo, status, observacoes, orientacao_demonstrativa, periodo_referencia, is_demo) VALUES
-- Padaria (5 rotinas inspiradas na referência visual)
(1, 'ROT-PAD-01', 1, 2, 'Conferir temperaturas e registros', 'Manhã', 'Padeiro(a) — Turno A (Demo)', 'Diária · até 07:30', 'Concluída', 'Registros dentro do padrão (balcão refrigerado a 4,2 °C).', 'Verificar temperaturas de câmaras, balcões e registrar no formulário de controle do setor.', '30d', 1),
(2, 'ROT-PAD-02', 1, 2, 'Higienizar superfícies e utensílios', 'Manhã', 'Auxiliar de padaria (Demo)', 'Diária · até 08:00', 'Concluída', 'Higiene realizada conforme orientação demonstrativa.', 'Limpar bancadas de inox, formas, utensílios de corte e equipamentos de preparo antes do início da batelada.', '30d', 1),
(3, 'ROT-PAD-03', 1, 2, 'Verificar etiquetas e validade', 'Manhã', 'Auxiliar de padaria (Demo)', 'Diária · até 08:30', 'Concluída', 'Todos os produtos fracionados com data de fabricação e validade legíveis.', 'Conferir datas de validade, lote interno e etiquetas de identificação dos produtos expostos.', '30d', 1),
(4, 'ROT-PAD-04', 1, 2, 'Organizar exposição e reposição', 'Manhã', 'Padeiro(a) — Turno A (Demo)', 'Diária · até 09:30', 'Pendente', 'Aguardar saída da segunda fornada para recompor ilha central.', 'Abastecer vitrines, organizar sortimento por família de produto e verificar necessidade de reposição.', '30d', 1),
(5, 'ROT-PAD-05', 1, 2, 'Conferir equipamentos', 'Manhã', 'Técnico(a) / Encarregado (Demo)', 'Diária · até 10:00', 'Pendente', 'Programado para após a reposição matinal.', 'Verificar funcionamento de fornos, cilindros, batedeiras, balcões térmicos e vedação de portas.', '30d', 1),

-- Hortifrúti (5 rotinas)
(6, 'ROT-HOR-01', 1, 3, 'Triagem matinal de folhosos e frutas sensíveis', 'Manhã', 'Repositor de Hortifrúti (Demo)', 'Diária · até 07:15', 'Concluída', 'Retirada preventiva de itens com perda de frescor realizada.', 'Avaliar aspecto visual, firmeza e integridade das embalagens antes da abertura da loja.', '30d', 1),
(7, 'ROT-HOR-02', 1, 3, 'Higienização de bancas, cestos e balanças', 'Manhã', 'Auxiliar de Hortifrúti (Demo)', 'Diária · até 07:45', 'Concluída', 'Bancas secas e sanitizadas sem resíduos orgânicos.', 'Remover resíduos vegetais, higienizar superfícies de apoio e aferir limpeza dos pratos de balança.', '30d', 1),
(8, 'ROT-HOR-03', 1, 3, 'Verificação de nebulização e refrigeração de processados', 'Manhã', 'Marcos Vinícius S. (Demo)', 'Diária · 08:00 e 14:00', 'Concluída', 'Ilha de minimamente processados mantida a 5,0 °C.', 'Checar funcionamento dos bicos nebulizadores e temperatura do expositor de saladas prontas.', '30d', 1),
(9, 'ROT-HOR-04', 1, 3, 'Conferência de rastreabilidade e origem nas gôndolas', 'Tarde', 'Repositor de Hortifrúti (Demo)', 'Diária · até 14:30', 'Concluída', 'Etiquetas de lote/produtor atualizadas na reposição da tarde.', 'Garantir que os lotes recebidos no dia contenham identificação de origem e data de entrada.', '30d', 1),
(10, 'ROT-HOR-05', 1, 3, 'Organização da câmara de recepção vegetal (PVPS)', 'Tarde', 'Marcos Vinícius S. (Demo)', 'Diária · até 17:00', 'Concluída', 'Caixas plásticas paletizadas e separadas por sensibilidade ao frio.', 'Empilhar caixas sobre estrados limpos, respeitando distância das paredes e ordem de entrada.', '30d', 1),

-- Açougue (5 rotinas)
(11, 'ROT-ACO-01', 1, 1, 'Aferição de câmara fria e sala de climatização', 'Manhã', 'Açougueiro Líder (Demo)', 'Diária · 07:00, 13:00 e 19:00', 'Concluída', 'Câmara a 1,8 °C e sala de desossa a 14,5 °C.', 'Registrar temperatura das câmaras e do ambiente de manipulação climatizado em planilha do setor.', '30d', 1),
(12, 'ROT-ACO-02', 1, 1, 'Inspeção de recepção de carcaças e cortes refrigerados', 'Manhã', 'Carlos Eduardo M. (Demo)', 'A cada recebimento', 'Concluída', 'Lote matinal recebido a 3,6 °C com selo de inspeção conferido.', 'Conferir temperatura da carga, condições de higiene do veículo, integridade de vácuo e rotulagem.', '30d', 1),
(13, 'ROT-ACO-03', 1, 1, 'Higienização de serra-fita, moedor e cepos de corte', 'Tarde', 'Operador de Açougue (Demo)', 'Diária · Troca de turno', 'Concluída', 'Desmontagem completa das peças móveis executada às 13h30.', 'Desmontar componentes em contato com carnes, lavar com detergente neutro e aplicar sanitizante autorizado.', '30d', 1),
(14, 'ROT-ACO-04', 1, 1, 'Verificação de validade de bandejas de autoatendimento', 'Tarde', 'Auxiliar de Açougue (Demo)', 'Diária · até 15:00', 'Concluída', '100% das bandejas do balcão self-service auditadas.', 'Conferir integridade do filme, ausência de exsudato excessivo e legibilidade da etiqueta.', '30d', 1),
(15, 'ROT-ACO-05', 1, 1, 'Registro de descarte controlado e limpeza de coletores', 'Noite', 'Operador de Fechamento (Demo)', 'Diária · até 20:30', 'Pendente', 'Aguardando encerramento do atendimento no balcão.', 'Pesar subprodutos, registrar na planilha de prevenção de perdas e higienizar área de armazenamento.', '30d', 1),

-- Mercearia & Frente de Caixa
(16, 'ROT-MER-01', 1, 4, 'Auditoria PVPS e integridade de embalagens em laticínios', 'Manhã', 'Juliana Alves (Demo)', 'Diária · até 09:00', 'Concluída', 'Corredor de iogurtes e queijos revisado sem itens vencidos.', 'Aplicar regra Primeiro que Vence, Primeiro que Sai e segregar embalagens estufadas ou avariadas.', '30d', 1),
(17, 'ROT-MER-02', 1, 4, 'Organização e limpeza de estrados no depósito seco', 'Tarde', 'Repositor de Mercearia (Demo)', 'Diária · até 16:00', 'Pendente', 'Recebimento de carga em andamento na doca 2.', 'Manter corredor de inspeção livre, produtos afastados da parede e piso limpo.', '30d', 1),
(18, 'ROT-FCX-01', 1, 5, 'Higienização de esteiras e leitores ópticos dos checkouts', 'Manhã', 'Patrícia Gomes (Demo)', 'Diária · Abertura e 14:00', 'Concluída', 'Checkouts 01 a 08 higienizados antes do pico das 11h.', 'Limpar tapetes rolantes e balanças de checkout com solução higienizante apropriada.', '30d', 1),
(19, 'ROT-FCX-02', 1, 5, 'Conferência de separadores para itens químicos vs. alimentos', 'Tarde', 'Fiscal de Caixa (Demo)', 'Diária · até 15:30', 'Pendente', 'Repor sacolas identificadas nos caixas rápidos.', 'Verificar disponibilidade de embalagens para separação segura de saneantes e alimentos.', '30d', 1);

-- 8. Avaliações de Ambiente (Ciclos de Diagnóstico)
INSERT INTO avaliacoes_ambiente (id, codigo, unidade_id, departamento_id, ciclo, data_avaliacao, indice_conformidade, eixo_critico, resumo_tecnico, is_demo) VALUES
(1, 'AVL-2026-01', 1, 2, '1ª Avaliação de Ambiente — Diagnóstico Inicial', '2026-09-12', 68, 'Padronização de rotulagem e controle térmico', 'Identificada oportunidade de padronizar a identificação de produtos fracionados na Padaria e instituir rotina fixa de abertura às 07h.', 1),
(2, 'AVL-2026-02', 1, 1, '2ª Avaliação de Ambiente — Ciclo Evolutivo', '2026-10-05', 84, 'Registros de troca de turno e prevenção de perdas', 'Evolução expressiva na higiene operacional do Açougue (+16 pts). Próximo passo focado na passagem de turno vespertina.', 1),
(3, 'AVL-2026-03', 1, 3, '2ª Avaliação de Ambiente — Ciclo Evolutivo', '2026-10-10', 90, 'Capacitação de novos colaboradores', 'Hortifrúti com excelente padrão visual e sanitário. Recomendado concluir trilha funcional para 2 novos integrantes.', 1);

-- 9. Planos de Ação (Vinculados às Avaliações e Indicadores)
INSERT INTO planos_acao (id, codigo, unidade_id, departamento_id, avaliacao_id, titulo, objetivo, indicador_vinculado, etapa_atual, responsavel_nome, prazo, prioridade, status, notas_acompanhamento, is_demo) VALUES
(1, 'PA-2026-01', 1, 2, 1, 'Padronização de etiquetagem e validade de fracionados na Padaria', 'Garantir 100% de rastreabilidade interna e informação clara de validade nos produtos de fabricação própria e confeitaria.', 'Rotinas em dia (Padaria)', 'Validação de campo com a liderança', 'Fernanda Rocha (Demo)', '2026-10-25', 'Alta', 'Em andamento', 'Etiquetadora revisada e tabela de vida útil fixada na área de porcionamento. Em acompanhamento diário na abertura.', 1),
(2, 'PA-2026-02', 1, 1, 2, 'Implantação do ritual de passagem de turno e aferição térmica no Açougue', 'Assegurar continuidade dos registros de temperatura das câmaras e higienização de equipamentos entre os turnos da manhã e da tarde.', 'Conformidade Sanitária (Açougue)', 'Treinamento prático concluído · Monitoramento 15 dias', 'Carlos Eduardo M. (Demo)', '2026-10-29', 'Alta', 'Em validação', 'Líderes do turno 1 e turno 2 utilizando o quadro de gestão à vista. Redução de falhas de preenchimento em 85% (dado demonstrativo).', 1),
(3, 'PA-2026-03', 1, 3, 3, 'Integração técnica de novos repositores na trilha de Hortifrúti', 'Alinhar a equipe recém-admitida ao padrão de triagem matinal, manejo delicado e organização por famílias sensoriais.', 'Capacitação da Equipe (Hortifrúti)', 'Agendamento da sessão on-line', 'Marcos Vinícius S. (Demo)', '2026-11-05', 'Média', 'Não iniciado', 'Encontro agendado para 20/Out às 14h00 com acompanhamento da consultoria.', 1),
(4, 'PA-2026-04', 1, 4, NULL, 'Revisão da rotina PVPS no corredor de laticínios e resfriados', 'Prevenir perdas por vencimento e melhorar a organização das gôndolas refrigeradas nos horários de maior fluxo.', 'Prevenção de Perdas (Mercearia)', 'Ciclo concluído e incorporado à rotina', 'Juliana Alves (Demo)', '2026-10-14', 'Média', 'Concluído', 'Planilha de controle simplificada implantada com sucesso e validada com a gerência.', 1),
(5, 'PA-2026-05', 1, 5, NULL, 'Orientação de embalagem segura e higienização rápida nos checkouts', 'Evitar contato entre saneantes e alimentos perecíveis no empacotamento e manter padrão higiênico das esteiras.', 'Rotinas em dia (Frente de Caixa)', 'Execução da 2ª semana de acompanhamento', 'Patrícia Gomes (Demo)', '2026-10-30', 'Programada', 'Em andamento', 'Adesivos orientativos instalados nos terminais de caixa para apoio visual aos operadores.', 1);
