import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AppPrototype from './pages/AppPrototype';

export default function App() {
  const [route, setRoute] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (targetPath) => {
    window.history.pushState({}, '', targetPath);
    setRoute(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (route.startsWith('/app')) {
    const initialScreen = route === '/app/login' ? 'login' : 'visao-geral';
    return (
      <AppPrototype
        key={initialScreen}
        initialScreen={initialScreen}
        onBackToSite={() => navigateTo('/')}
      />
    );
  }

  return <LandingPage onNavigateApp={(path) => navigateTo(path || '/app')} />;
}
