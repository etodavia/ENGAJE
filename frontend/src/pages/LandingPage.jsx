import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutGrid,
  TrendingDown,
  GraduationCap,
  Users,
  FileCheck2,
  Check,
  ArrowUpRight,
  Smartphone,
  MessageCircle,
  Mail,
  Instagram,
  LogIn,
  X
} from 'lucide-react';
import Header from '../components/Header';
import SolutionCard from '../components/SolutionCard';
import ProgramCard from '../components/ProgramCard';
import TestimonialCard from '../components/TestimonialCard';
import FaqAccordion from '../components/FaqAccordion';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const WHATSAPP_URL = 'https://wa.me/554799533709';
const EMAIL_ADDRESS = 'administrativo@engajesolucoes.com.br';

const SOLUTIONS_DATA = [
  {
    icon: ShieldCheck,
    title: 'Processos sanitários',
    description:
      'Adequação higiênico-sanitária prática nos setores de manipulação, recepção, armazenamento e exposição de alimentos.'
  },
  {
    icon: LayoutGrid,
    title: 'Gestão funcional',
    description:
      'Organização de fluxos operacionais, definição clara de atribuições por turno e padronização da rotina de loja.'
  },
  {
    icon: TrendingDown,
    title: 'Prevenção de perdas',
    description:
      'Controle técnico de validade, conservação térmica, manejo correto e aproveitamento seguro para reduzir quebras.'
  },
  {
    icon: GraduationCap,
    title: 'Capacitação de equipes',
    description:
      'Treinamentos aplicados à realidade do supermercado, traduzindo normas técnicas em hábitos consistentes no dia a dia.'
  },
  {
    icon: Users,
    title: 'Desenvolvimento de lideranças',
    description:
      'Preparação de gerentes e encarregados de setor para conduzir pessoas, cobrar padrões com respeito e acompanhar metas.'
  },
  {
    icon: FileCheck2,
    title: 'Documentação sanitária',
    description:
      'Elaboração e atualização de Manuais de Boas Práticas, POPs e planilhas de controle alinhados às exigências vigentes.'
  }
];

const CONSULTORIA_POINTS = [
  'Diagnóstico de setores, processos e equipes',
  'Padronização de rotinas e organização operacional',
  'Capacitação técnica e comportamental',
  'Acompanhamento de indicadores e planos de ação',
  'Inovação em processos, produtos e experiência com alimentos'
];

const COMO_ATUAMOS_STEPS = [
  {
    step: 'Etapa 01',
    title: 'Entender',
    description: 'Levantar necessidades, rotinas, indicadores e pontos críticos.'
  },
  {
    step: 'Etapa 02',
    title: 'Planejar',
    description: 'Definir prioridades, metas e ações adequadas ao negócio.'
  },
  {
    step: 'Etapa 03',
    title: 'Engajar',
    description: 'Capacitar lideranças e equipes.'
  },
  {
    step: 'Etapa 04',
    title: 'Acompanhar',
    description: 'Revisar resultados, ajustar ações e orientar próximos passos.'
  }
];

const PROGRAMS_DATA = [
  {
    tag: 'Estruturação inicial',
    title: 'Engajamento 360º',
    description:
      'Pacote completo de diagnóstico e planejamento para alinhar pessoas, rotina e objetivos do negócio.',
    items: [
      '1 avaliação de ambiente',
      'Mapeamento de oportunidades',
      'Plano inicial de engajamento',
      'Alinhamento de ações com equipe e liderança'
    ],
    featured: false
  },
  {
    tag: 'Aprimoramento contínuo',
    title: 'Engajamento Evolutivo',
    description:
      'Programa para empresas que já possuem iniciativas de engajamento e desejam aprimorar processos, métricas e cultura organizacional.',
    items: [
      '2 avaliações de ambiente',
      'Capacitação on-line para liderança e equipe',
      'Execução de plano de ação',
      'Apoio na formulação de planilhas de controle',
      'Resumo digital do andamento e da eficácia das ações'
    ],
    featured: true
  },
  {
    tag: 'Imersão prática & sensorial',
    title: 'Engaja+',
    description:
      'Programa prático que combina capacitação, experiência sensorial e acompanhamento de resultados.',
    items: [
      '2 avaliações de ambiente',
      'Treinamentos para liderança',
      'Workshops para a equipe',
      'Workshop sensorial sobre alimentos, ingredientes e produtos',
      'Planilhas de controle e instruções personalizadas',
      'Reunião com panorama de performance e planejamento estratégico'
    ],
    featured: false
  }
];

const TESTIMONIALS_DATA = [
  {
    quote:
      'A Thaís sempre foi uma médica veterinária muito importante no nosso trabalho e no desenvolvimento do Frigorífico São João. Sempre foi muito competente e trabalhamos muito bem em equipe.',
    author: 'Sirlei Nazario',
    roleAndCompany: 'Gestão comercial, Frigorífico São João'
  },
  {
    quote:
      'Você demonstra um perfil técnico sólido e proativo, com grande capacidade de transformar desafios em oportunidades. Os processos implantados fortalecem a operação.',
    author: 'Adriana Batista',
    roleAndCompany: 'Gerente de unidade, Hortifruti Direto do Campo'
  },
  {
    quote:
      'A loja se apoia muito em seu trabalho. Percebi que você é referência naquela loja. Achei isso bem legal!',
    author: 'Vanessa Dimon',
    roleAndCompany: 'Proprietária, Hortifruti Direto do Campo'
  }
];

const FAQ_DATA = [
  {
    question: 'A Engaje atende apenas supermercados?',
    answer:
      'Nossa especialidade central está em supermercados, hortifrútis, padarias, açougues e operações do setor de alimentos. Como cada operação possui particularidades próprias, o escopo técnico é sempre personalizado conforme a estrutura, o porte e os processos manipulados pela empresa.'
  },
  {
    question: 'Como funciona o primeiro contato?',
    answer:
      'O contato inicial consiste em uma conversa de diagnóstico para compreender o momento atual da operação, os desafios dos setores, a estrutura da equipe e as prioridades da gestão. A partir dessa escuta qualificada, desenhamos a proposta técnica mais adequada.'
  },
  {
    question: 'Os pacotes têm preço fixo?',
    answer:
      'Não trabalhamos com tabelas engessadas. O escopo, a duração e o investimento de cada programa (Engajamento 360º, Engajamento Evolutivo ou Engaja+) são definidos sob medida conforme a necessidade, o número de setores e os objetivos da sua empresa.'
  },
  {
    question: 'O aplicativo já está disponível?',
    answer:
      'O App Engaje ainda está em fase de planejamento. As funcionalidades definitivas e a disponibilidade oficial serão divulgadas quando estiverem concluídas. Você já pode navegar pela prévia conceitual interativa nesta página ou registrar seu interesse pelo WhatsApp.'
  }
];

export default function LandingPage({ onNavigateApp }) {
  const [selectedService, setSelectedService] = useState('Diagnóstico e Consultoria Técnica');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const handleSelectProgram = (programTitle) => {
    setSelectedService(programTitle);
  };

  return (
    <div id="topo">
      {/* 1. CABEÇALHO FIXO */}
      <Header onNavigateApp={onNavigateApp} />

      <main>
        {/* 2. SEÇÃO PRINCIPAL (HERO COM DEGRADÊ ANIMADO PREMIUM E ENTRADA SUAVE DA FUNDADORA) */}
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-supermarket-backdrop" aria-hidden="true" />
          <div className="hero-animated-gradient-overlay" aria-hidden="true" />
          <div className="hero-soft-sage-glow" aria-hidden="true" />
          <div className="hero-bottom-gold-line" aria-hidden="true" />

          <div className="container hero-container">
            <div className="hero-copy">
              <div className="hero-support-pill">
                <span className="eyebrow-dot" />
                <span>Consultoria Técnica para Supermercados e Alimentos</span>
              </div>

              <h1 id="hero-heading" className="hero-title">
                Pessoas preparadas.
                <span>Operações mais seguras.</span>
              </h1>

              <p className="hero-description">
                Desenvolvemos equipes, organizamos processos e fortalecemos a segurança dos
                alimentos para transformar a rotina do supermercado em resultados consistentes.
              </p>

              <div className="hero-cta-group">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold-light"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Agendar uma conversa
                </a>

                <a href="#solucoes" className="btn btn-outline-light">
                  Conheça as soluções
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>

              <div className="hero-support-line">
                <span>Diagnóstico personalizado · Capacitação · Acompanhamento</span>
              </div>
            </div>

            <div className="hero-visual-col">
              <div className="hero-founder-halo" aria-hidden="true" />
              <figure className="hero-founder-figure">
                <img
                  src="/assets/thais-hero-cutout.png"
                  alt="Dra. Thaís da Luz, médica veterinária e fundadora da Engaje Soluções, utilizando tablet em contexto de consultoria para supermercados"
                  className="hero-founder-img"
                />
                <figcaption className="hero-floating-card">
                  <strong>Conhecimento que engaja.</strong>
                  <span>Qualidade que se percebe em cada etapa da operação.</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 3. SEÇÃO DE DESAFIOS E SOLUÇÕES */}
        <section id="solucoes" className="section-block" aria-labelledby="solucoes-heading">
          <div className="container">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Desafios &amp; Soluções Operacionais</span>
            </div>
            <h2 id="solucoes-heading" className="section-title">
              Mais clareza na operação. Mais confiança na equipe.
            </h2>
            <p className="section-subtitle">
              Atuamos nos pontos críticos da rotina do varejo alimentar para unir segurança
              sanitária, organização funcional e engajamento das pessoas.
            </p>

            <div className="solutions-grid">
              {SOLUTIONS_DATA.map((item, idx) => (
                <SolutionCard
                  key={item.title}
                  index={idx + 1}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 4. SEÇÃO SOBRE A CONSULTORIA */}
        <section
          className="section-block bg-cream-alt"
          aria-labelledby="consultoria-heading"
        >
          <div className="container consultoria-grid">
            <div className="editorial-image-frame" style={{ aspectRatio: '4 / 3' }}>
              <img
                src="/assets/founder-consulting.jpg?v=2"
                alt="Dra. Thaís da Luz em atuação técnica no corredor do supermercado com tablet da Engaje Consultoria"
                style={{ objectPosition: 'center top' }}
                loading="lazy"
              />
            </div>

            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>Presença Técnica &amp; Humana</span>
              </div>
              <h2 id="consultoria-heading" className="section-title">
                Uma consultoria próxima da realidade do seu supermercado.
              </h2>
              <p className="section-subtitle" style={{ maxWidth: '100%' }}>
                Cada empresa possui desafios próprios de estrutura, fluxo e equipe. Por isso, a
                Engaje combina conhecimento técnico rigoroso, observação atenta da rotina em loja e
                participação ativa dos colaboradores para construir melhorias duradouras.
              </p>

              <ul className="consultoria-checklist">
                {CONSULTORIA_POINTS.map((point) => (
                  <li key={point}>
                    <span className="check-bullet" aria-hidden="true">
                      <Check size={14} strokeWidth={2.6} />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Conversar sobre minha operação
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* 5. SEÇÃO "COMO ATUAMOS" */}
        <section
          id="como-atuamos"
          className="section-block bg-dark-green"
          aria-labelledby="como-atuamos-heading"
        >
          <div className="container">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Metodologia Engaje</span>
            </div>
            <h2 id="como-atuamos-heading" className="section-title">
              Uma jornada construída junto com a sua equipe.
            </h2>
            <p className="section-subtitle">
              Estruturamos o trabalho em quatro etapas claras para transformar diagnóstico técnico
              em hábito operacional consistente.
            </p>

            <div className="steps-grid">
              {COMO_ATUAMOS_STEPS.map((item) => (
                <article key={item.title} className="step-card">
                  <span className="step-number">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SEÇÃO DE PROGRAMAS DE ENGAJAMENTO */}
        <section id="programas" className="section-block" aria-labelledby="programas-heading">
          <div className="container">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Programas de Engajamento</span>
            </div>
            <h2 id="programas-heading" className="section-title">
              Escolha o nível de acompanhamento ideal.
            </h2>
            <p className="section-subtitle">
              Programas estruturados para diferentes estágios de maturidade operacional, do
              diagnóstico inicial à evolução contínua de líderes e setores.
            </p>

            <div className="programs-grid">
              {PROGRAMS_DATA.map((prog) => (
                <ProgramCard
                  key={prog.title}
                  tag={prog.tag}
                  title={prog.title}
                  description={prog.description}
                  items={prog.items}
                  featured={prog.featured}
                  onSelectProgram={handleSelectProgram}
                />
              ))}
            </div>

            <div className="programs-note">
              <strong>Observação importante:</strong> O escopo, a duração e o investimento são
              definidos de forma personalizada conforme os objetivos, os setores atendidos e a
              estrutura de cada empresa.
            </div>
          </div>
        </section>

        {/* 7. SEÇÃO DO APLICATIVO (APP ENGAJE — PRÉVIA CONCEITUAL) */}
        <section
          id="app-engaje"
          className="section-block bg-cream-alt"
          aria-labelledby="app-engaje-heading"
        >
          <div className="container app-preview-grid">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>App Engaje · Prévia Conceitual</span>
              </div>
              <h2 id="app-engaje-heading" className="section-title">
                Uma nova forma de acompanhar o desenvolvimento da operação.
              </h2>
              <p className="section-subtitle" style={{ maxWidth: '100%' }}>
                A Engaje está planejando um aplicativo para apoiar o acompanhamento das ações,
                indicadores e evolução das equipes. A proposta é reunir informações importantes em
                uma experiência simples e útil para a gestão.
              </p>

              <div className="app-feature-pills" aria-label="Elementos conceituais planejados">
                <span className="app-pill">Plano de ação</span>
                <span className="app-pill">Capacitação da equipe</span>
                <span className="app-pill">Indicadores</span>
                <span className="app-pill">Acompanhamento da operação</span>
              </div>

              <div className="app-planning-note">
                <strong>Prévia conceitual:</strong> O aplicativo está em planejamento. As
                funcionalidades e a disponibilidade serão divulgadas quando estiverem definidas.
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem' }}>
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                    'Olá! Tenho interesse em conhecer novidades sobre o App Engaje.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Smartphone size={17} aria-hidden="true" />
                  Tenho interesse no App
                </a>

                <button
                  type="button"
                  onClick={() => onNavigateApp('/app')}
                  className="btn btn-outline"
                >
                  <LogIn size={17} aria-hidden="true" />
                  Explorar protótipo navegável
                </button>
              </div>
            </div>

            <div className="phone-mockup-stage">
              <div
                style={{
                  marginBottom: '0.85rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-green-primary)',
                  backgroundColor: 'rgba(255,255,255,0.75)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '999px'
                }}
              >
                Prévia conceitual · Dados demonstrativos
              </div>

              <div className="phone-device" role="img" aria-label="Mockup conceitual do aplicativo Engaje em um celular">
                <div className="phone-notch" />
                <div className="phone-header-badge">
                  <img
                    src="/assets/logo-engaje.png"
                    alt="Engaje Soluções"
                    style={{ height: '24px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }}
                  />
                  <span style={{ color: 'var(--color-gold)' }}>Protótipo</span>
                </div>

                <div className="phone-card-item">
                  <strong>Plano de ação</strong>
                  <span>Padronização de rotulagem — Padaria (Demo)</span>
                  <div className="phone-bar-track">
                    <div className="phone-bar-fill" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="phone-card-item">
                  <strong>Capacitação da equipe</strong>
                  <span>Boas práticas na manipulação — 82% (Demo)</span>
                  <div className="phone-bar-track">
                    <div className="phone-bar-fill" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="phone-card-item">
                  <strong>Indicadores &amp; Rotinas</strong>
                  <span>Hortifrúti e Açougue — Rotinas verificadas (Demo)</span>
                  <div className="phone-bar-track">
                    <div className="phone-bar-fill" style={{ width: '86%' }} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateApp('/app')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.58rem', fontSize: '0.8rem', marginTop: '0.35rem' }}
                >
                  Abrir demonstração interativa
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 8. DEPOIMENTOS */}
        <section className="section-block" aria-labelledby="depoimentos-heading">
          <div className="container">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Reconhecimento em Campo</span>
            </div>
            <h2 id="depoimentos-heading" className="section-title">
              Parceria técnica que se constrói na prática.
            </h2>
            <p className="section-subtitle">
              Relatos de gestores e profissionais que vivenciaram a atuação técnica e colaborativa
              da Dra. Thaís da Luz.
            </p>

            <div className="testimonials-grid">
              {TESTIMONIALS_DATA.map((item) => (
                <TestimonialCard
                  key={item.author}
                  quote={item.quote}
                  author={item.author}
                  roleAndCompany={item.roleAndCompany}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 9. SEÇÃO SOBRE A FUNDADORA */}
        <section
          id="sobre"
          className="section-block bg-cream-alt"
          aria-labelledby="fundadora-heading"
        >
          <div className="container founder-grid">
            <div className="editorial-image-frame">
              <img
                src="/assets/founder-about.jpg"
                alt="Dra. Thaís da Luz — Médica veterinária, pesquisadora CNPq e fundadora da Engaje Soluções"
                loading="lazy"
              />
            </div>

            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>Liderança Técnica &amp; Científica</span>
              </div>
              <h2 id="fundadora-heading" className="section-title">
                Dra. Thaís da Luz
              </h2>
              <p
                style={{
                  fontSize: '1.08rem',
                  color: 'var(--color-text-dark)',
                  marginTop: '1.15rem',
                  lineHeight: 1.75
                }}
              >
                Médica veterinária, pesquisadora CNPq e fundadora da Engaje Soluções. Formada pela
                UFPR, com pós-graduação em Inovação em Processos e Produtos na Indústria de
                Alimentos pela Católica SC, é especialista em consultoria de manipulação de
                alimentos.
              </p>
              <p
                style={{
                  fontSize: '1.04rem',
                  color: 'var(--color-text-body)',
                  marginTop: '1rem',
                  lineHeight: 1.75,
                  paddingLeft: '1rem',
                  borderLeft: '3px solid var(--color-gold)'
                }}
              >
                Sua atuação une conhecimento técnico e atenção às pessoas, com a convicção de que a
                alimentação pode ser natural, nutritiva e transformadora.
              </p>

              <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.9rem' }}>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Agendar conversa com a Dra. Thaís
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a
                  href="https://instagram.com/thaisluzconsultoria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Instagram size={16} aria-hidden="true" />
                  @thaisluzconsultoria
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 10. PERGUNTAS FREQUENTES */}
        <section className="section-block" aria-labelledby="faq-heading">
          <div className="container faq-wrapper">
            <div style={{ textAlign: 'center' }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>
                <span className="eyebrow-dot" />
                <span>Dúvidas Comuns</span>
              </div>
              <h2 id="faq-heading" className="section-title">
                Vamos esclarecer.
              </h2>
              <p className="section-subtitle" style={{ margin: '0.85rem auto 0' }}>
                Informações transparentes sobre nossa forma de atendimento, programas e o
                planejamento do App Engaje.
              </p>
            </div>

            <FaqAccordion items={FAQ_DATA} />
          </div>
        </section>

        {/* 11. SEÇÃO FINAL DE CONTATO E FORMULÁRIO FUNCIONAL MYSQL */}
        <section
          id="contato"
          className="section-block bg-cream-alt"
          aria-labelledby="contato-heading"
        >
          <div className="container contact-section-grid">
            <div className="contact-info-box">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>Atendimento Comercial</span>
              </div>
              <h2 id="contato-heading" className="section-title" style={{ fontSize: 'clamp(1.55rem, 2.1vw, 1.92rem)' }}>
                Vamos fortalecer a equipe e a operação do seu supermercado?
              </h2>
              <p style={{ marginTop: '1rem', color: 'var(--color-text-body)', fontSize: '1rem' }}>
                Entre em contato diretamente pelos nossos canais oficiais ou preencha o formulário
                ao lado para agendarmos uma conversa inicial de diagnóstico.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                  marginTop: '1.65rem'
                }}
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  Conversar pelo WhatsApp
                </a>

                <a href={`mailto:${EMAIL_ADDRESS}`} className="btn btn-outline">
                  <Mail size={17} aria-hidden="true" />
                  Enviar e-mail
                </a>
              </div>

              <ul className="contact-direct-list" aria-label="Canais diretos de contato">
                <li>
                  <MessageCircle size={18} aria-hidden="true" />
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    WhatsApp: +55 47 9953-3709
                  </a>
                </li>
                <li>
                  <Mail size={18} aria-hidden="true" />
                  <a href={`mailto:${EMAIL_ADDRESS}`}>
                    E-mail: administrativo@engajesolucoes.com.br
                  </a>
                </li>
                <li>
                  <Instagram size={18} aria-hidden="true" />
                  <a
                    href="https://instagram.com/thaisluzconsultoria"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram: @thaisluzconsultoria
                  </a>
                </li>
              </ul>
            </div>

            <ContactForm
              preselectedService={selectedService}
              onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
            />
          </div>
        </section>
      </main>

      {/* 12. RODAPÉ */}
      <Footer
        onNavigateApp={onNavigateApp}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* MODAL DE POLÍTICA DE PRIVACIDADE PLACEHOLDER (LGPD) */}
      {privacyModalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
        >
          <div className="modal-panel">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <h3
                id="privacy-modal-title"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  color: 'var(--color-green-primary)'
                }}
              >
                Política de Privacidade e Tratamento de Dados
              </h3>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-green-primary)'
                }}
                aria-label="Fechar política de privacidade"
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', marginBottom: '0.85rem' }}>
              A <strong>Engaje Consultoria e Serviços Veterinários Ltda</strong> (CNPJ
              24.112.913/0001-68) coleta no formulário de contato apenas os dados estritamente
              necessários (nome, empresa, e-mail, telefone/WhatsApp, serviço de interesse e
              mensagem) para responder à sua solicitação comercial.
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', marginBottom: '1.25rem' }}>
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD), os
              dados não são compartilhados com terceiros nem utilizados para disparos automáticos
              não autorizados. Você pode solicitar a atualização ou exclusão do seu registro a
              qualquer momento pelo e-mail{' '}
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                style={{ textDecoration: 'underline', fontWeight: 600 }}
              >
                {EMAIL_ADDRESS}
              </a>
              .
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setPrivacyModalOpen(false)}
              style={{ width: '100%' }}
            >
              Compreendi e fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
