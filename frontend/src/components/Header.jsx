import React, { useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';

export default function Header({ onNavigateApp }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#topo' },
    { label: 'Soluções', href: '#solucoes' },
    { label: 'App Engaje', href: '#app-engaje' },
    { label: 'Sobre', href: '#sobre' }
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header" role="banner">
      <div className="container header-inner">
        <a href="#topo" className="brand-logo" aria-label="Engaje Soluções — Início">
          <img
            src="/assets/logo-engaje.png"
            alt="Logo Engaje Soluções"
            style={{
              height: '52px',
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply'
            }}
          />
        </a>

        <nav className="header-nav" aria-label="Navegação principal" style={{ gap: '2.4rem' }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{ whiteSpace: 'nowrap' }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            onClick={() => onNavigateApp('/app/login')}
            className="btn btn-primary"
            style={{ display: 'inline-flex' }}
            title="Acessar o sistema App Engaje"
          >
            <LogIn size={16} aria-hidden="true" />
            Entrar no Sistema
          </button>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation-menu"
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Menu de navegação móvel"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="nav-link"
            onClick={handleNavClick}
          >
            {item.label}
          </a>
        ))}
        <div style={{ marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateApp('/app/login');
            }}
            className="btn btn-primary"
            style={{ width: '100%', display: 'inline-flex' }}
          >
            <LogIn size={16} aria-hidden="true" />
            Entrar no Sistema
          </button>
        </div>
      </nav>
    </header>
  );
}
