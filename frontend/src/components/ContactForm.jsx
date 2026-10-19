import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const SERVICOS_OPCOES = [
  'Diagnóstico e Consultoria Técnica',
  'Engajamento 360º',
  'Engajamento Evolutivo',
  'Engaja+',
  'Capacitação de Equipes e Lideranças',
  'Processos e Documentação Sanitária',
  'Interesse no App Engaje (Em planejamento)'
];

export default function ContactForm({ preselectedService, onOpenPrivacyModal }) {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    servico_interesse: preselectedService || 'Diagnóstico e Consultoria Técnica',
    mensagem: '',
    consentimento: false,
    website_url: '' // Campo Honeypot invisível
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null);

  useEffect(() => {
    if (preselectedService && SERVICOS_OPCOES.includes(preselectedService)) {
      setFormData((prev) => ({ ...prev, servico_interesse: preselectedService }));
    }
  }, [preselectedService]);

  const validateClient = () => {
    const newErrors = {};
    if (!formData.nome || formData.nome.trim().length < 3) {
      newErrors.nome = 'Informe seu nome completo (mínimo de 3 caracteres).';
    }
    if (!formData.empresa || formData.empresa.trim().length < 2) {
      newErrors.empresa = 'Informe o nome do supermercado ou empresa.';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Informe um endereço de e-mail válido.';
    }
    const digits = (formData.telefone || '').replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      newErrors.telefone = 'Informe um telefone/WhatsApp válido com DDD (10 a 15 dígitos).';
    }
    if (!formData.servico_interesse) {
      newErrors.servico_interesse = 'Selecione o serviço ou programa de interesse.';
    }
    if (!formData.mensagem || formData.mensagem.trim().length < 10) {
      newErrors.mensagem = 'Descreva brevemente sua necessidade (mínimo de 10 caracteres).';
    }
    if (!formData.consentimento) {
      newErrors.consentimento = 'Confirme o consentimento para contato e tratamento dos dados.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusFeedback(null);

    const validationErrors = validateClient();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatusFeedback({
        type: 'error',
        text: 'Por favor, revise os campos obrigatórios destacados abaixo.'
      });
      return;
    }

    setSubmitting(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiBase}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setStatusFeedback({
          type: 'error',
          text: data.error || 'Não foi possível enviar o formulário. Verifique os campos informados.'
        });
      } else {
        setStatusFeedback({
          type: 'success',
          text:
            data.message ||
            'Contato registrado com sucesso! Retornaremos em breve para agendar seu diagnóstico.'
        });
        setFormData({
          nome: '',
          empresa: '',
          email: '',
          telefone: '',
          servico_interesse: 'Diagnóstico e Consultoria Técnica',
          mensagem: '',
          consentimento: false,
          website_url: ''
        });
        setErrors({});
      }
    } catch (err) {
      setStatusFeedback({
        type: 'error',
        text: 'Erro de comunicação com o servidor. Tente novamente ou chame pelo WhatsApp.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-form-card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.55rem',
            color: 'var(--color-green-primary)',
            marginBottom: '0.35rem'
          }}
        >
          Solicite uma conversa de diagnóstico
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
          Preencha os dados abaixo para que a Dra. Thaís da Luz e a equipe Engaje conheçam o momento da sua operação.
        </p>
      </div>

      {statusFeedback && (
        <div
          className={`alert-banner ${statusFeedback.type}`}
          role="alert"
          aria-live="polite"
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}
        >
          {statusFeedback.type === 'success' ? (
            <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          ) : (
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          )}
          <span>{statusFeedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Campo Honeypot contra robôs */}
        <div className="hp-field-trap" aria-hidden="true">
          <label htmlFor="website_url">Não preencha este campo</label>
          <input
            id="website_url"
            name="website_url"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="lead-nome">Nome *</label>
            <input
              id="lead-nome"
              name="nome"
              type="text"
              placeholder="Seu nome completo"
              className={`form-control ${errors.nome ? 'has-error' : ''}`}
              value={formData.nome}
              onChange={handleChange}
              required
            />
            {errors.nome && <span className="field-error">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lead-empresa">Empresa / Supermercado *</label>
            <input
              id="lead-empresa"
              name="empresa"
              type="text"
              placeholder="Nome da loja ou rede"
              className={`form-control ${errors.empresa ? 'has-error' : ''}`}
              value={formData.empresa}
              onChange={handleChange}
              required
            />
            {errors.empresa && <span className="field-error">{errors.empresa}</span>}
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="lead-email">E-mail *</label>
            <input
              id="lead-email"
              name="email"
              type="email"
              placeholder="voce@supermercado.com.br"
              className={`form-control ${errors.email ? 'has-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lead-telefone">Telefone / WhatsApp *</label>
            <input
              id="lead-telefone"
              name="telefone"
              type="tel"
              placeholder="(47) 99999-9999"
              className={`form-control ${errors.telefone ? 'has-error' : ''}`}
              value={formData.telefone}
              onChange={handleChange}
              required
            />
            {errors.telefone && <span className="field-error">{errors.telefone}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="lead-servico">Serviço ou programa de interesse *</label>
          <select
            id="lead-servico"
            name="servico_interesse"
            className={`form-control ${errors.servico_interesse ? 'has-error' : ''}`}
            value={formData.servico_interesse}
            onChange={handleChange}
          >
            {SERVICOS_OPCOES.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
          {errors.servico_interesse && (
            <span className="field-error">{errors.servico_interesse}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lead-mensagem">Mensagem *</label>
          <textarea
            id="lead-mensagem"
            name="mensagem"
            rows={4}
            placeholder="Conte-nos brevemente sobre os setores, desafios atuais ou objetivos da sua operação..."
            className={`form-control ${errors.mensagem ? 'has-error' : ''}`}
            value={formData.mensagem}
            onChange={handleChange}
            required
          />
          {errors.mensagem && <span className="field-error">{errors.mensagem}</span>}
        </div>

        <div className="consent-row">
          <input
            id="lead-consentimento"
            name="consentimento"
            type="checkbox"
            checked={formData.consentimento}
            onChange={handleChange}
            required
          />
          <label htmlFor="lead-consentimento">
            Autorizo a Engaje Soluções a entrar em contato e tratar os dados informados exclusivamente para atendimento comercial, conforme a{' '}
            <button
              type="button"
              className="link-inline-button"
              onClick={onOpenPrivacyModal}
            >
              Política de Privacidade (LGPD)
            </button>
            . *
          </label>
        </div>
        {errors.consentimento && (
          <div className="field-error" style={{ marginTop: '-0.85rem', marginBottom: '1rem' }}>
            {errors.consentimento}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ width: '100%', padding: '0.95rem' }}
        >
          <Send size={17} aria-hidden="true" />
          {submitting ? 'Enviando solicitação...' : 'Enviar mensagem para a Engaje'}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginTop: '0.95rem',
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <ShieldCheck size={15} style={{ color: 'var(--color-green-secondary)', flexShrink: 0 }} />
          <span>Seus dados são protegidos e utilizados apenas para retorno do diagnóstico solicitado.</span>
        </div>
      </form>
    </div>
  );
}
