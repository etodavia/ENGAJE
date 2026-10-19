import React from 'react';
import { LogIn } from 'lucide-react';

export default function Footer({ onNavigateApp, onOpenPrivacyModal }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                backgroundColor: 'var(--color-cream-bg)',
                padding: '0.4rem 0.7rem',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <img
                src="/assets/logo-engaje.png"
                alt="Logo Engaje Soluções"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div>
              <strong
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.18rem',
                  color: 'var(--color-cream-bg)',
                  letterSpacing: '0.06em'
                }}
              >
                Engaje Soluções &amp; Consultoria
              </strong>
              <span style={{ fontSize: '0.9rem', color: 'rgba(220, 231, 223, 0.85)' }}>
                Consultoria técnica especializada em supermercados.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
            <a href="#solucoes" style={{ fontSize: '0.9rem' }}>
              Soluções
            </a>
            <a href="#programas" style={{ fontSize: '0.9rem' }}>
              Programas
            </a>
            <a href="#app-engaje" style={{ fontSize: '0.9rem' }}>
              App Engaje
            </a>
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(244, 241, 233, 0.86)',
                textDecoration: 'underline',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Política de Privacidade
            </button>
            <button
              type="button"
              onClick={() => onNavigateApp('/app/login')}
              className="btn btn-outline-light"
              style={{ padding: '0.5rem 0.95rem', fontSize: '0.84rem' }}
            >
              <LogIn size={15} />
              Entrar no Sistema (Demo)
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            <span>Razão social: Engaje Consultoria e Serviços Veterinários Ltda</span>
            <span style={{ margin: '0 0.65rem' }}>·</span>
            <span>CNPJ: 24.112.913/0001-68</span>
          </div>
          <div>
            © {currentYear} Engaje Soluções &amp; Consultoria. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
