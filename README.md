# Engaje Soluções & Consultoria — Landing Page & Protótipo do App Engaje

Projeto completo contendo a **Landing Page institucional responsiva** e o **Protótipo navegável do Aplicativo Engaje** (`/app` e `/app/login`), desenvolvido com **React (Vite)** no front-end, **Node.js com Express** no back-end e **MySQL** como banco de dados relacional.

> **Aviso importante sobre o App Engaje:** O aplicativo interno está em fase de planejamento. Todas as telas, métricas e registros do módulo `/app` são claramente rotulados como **Protótipo / Prévia Conceitual / Dados Demonstrativos** (`is_demo = 1`) e não representam funcionalidades já disponíveis em produção.

---

## 1. Árvore de Pastas do Projeto

```text
ENGAJE/
├── README.md
├── database/
│   ├── schema.sql                # Script SQL de criação do banco engaje_db e todas as tabelas
│   └── seed.sql                  # Carga inicial demonstrativa (is_demo = 1) para o protótipo
├── backend/
│   ├── .env.example              # Exemplo de variáveis de ambiente (sem segredos expostos)
│   ├── package.json
│   └── src/
│       ├── server.js             # Servidor Express principal (porta 3001)
│       ├── config/
│       │   └── db.js             # Pool de conexão MySQL2 com consultas parametrizadas
│       ├── data/
│       │   └── demoSeedData.js   # Espelho local demonstrativo sincronizado com seed.sql
│       ├── middleware/
│       │   └── authMiddleware.js # Autorização por perfil (RBAC: consultora, gestor, líder)
│       ├── routes/
│       │   ├── leadsRoutes.js    # POST /api/leads (validação, honeypot e persistência MySQL)
│       │   └── appRoutes.js      # Endpoints REST do protótipo App Engaje
│       └── scripts/
│           └── initDb.js         # Utilitário CLI para rodar schema.sql e seed.sql no MySQL
└── frontend/
    ├── .env.example              # Variáveis de ambiente do front-end
    ├── index.html                # HTML semântico pt-BR, SEO, Open Graph e Google Fonts
    ├── package.json
    ├── vite.config.js            # Configuração Vite + proxy /api para http://localhost:3001
    ├── public/
    │   ├── favicon.svg
    │   └── assets/
    │       ├── logo-engaje.png
    │       ├── thais-hero-cutout.png
    │       ├── supermarket-bg.jpg
    │       ├── founder-consulting.jpg
    │       └── founder-about.jpg
    └── src/
        ├── main.jsx
        ├── App.jsx               # Roteamento entre Landing Page (/) e App (/app, /app/login)
        ├── styles/
        │   └── global.css        # Estilo editorial + Hero degradê animado + App responsivo
        ├── components/
        │   ├── Header.jsx        # Cabeçalho fixo + botão "Entrar no Sistema" + menu mobile
        │   ├── SolutionCard.jsx  # Cartões reutilizáveis de desafios e soluções
        │   ├── ProgramCard.jsx   # Cartões dos programas (360º, Evolutivo, Engaja+)
        │   ├── TestimonialCard.jsx
        │   ├── FaqAccordion.jsx
        │   ├── ContactForm.jsx   # Formulário funcional com honeypot, validação e LGPD
        │   └── Footer.jsx
        └── pages/
            ├── LandingPage.jsx   # Landing page completa com as 12 seções
            └── AppPrototype.jsx  # Módulo do App (Login, Dashboard, Treinamentos, Rotinas, Planos, Relatórios)
```

---

## 2. Configuração do Banco de Dados MySQL e `.env`

### 2.1. Criar o banco e as tabelas no MySQL
Você pode executar os arquivos SQL diretamente no seu cliente MySQL:

```bash
mysql -u seu_usuario -p < database/schema.sql
mysql -u seu_usuario -p < database/seed.sql
```

Ou configurar o arquivo `backend/.env` (copiando de `backend/.env.example`) e rodar o comando automatizado:

```bash
cd backend
cp .env.example .env
# Edite o arquivo .env com seu DB_USER e DB_PASSWORD locais
npm run db:init
```

---

## 3. Instalação e Execução Local

### Passo 1 — Instalar e iniciar o Back-end (Porta 3001)
```bash
cd backend
npm install
npm start
```

### Passo 2 — Instalar e iniciar o Front-end (Porta 5173)
```bash
cd frontend
npm install
npm run dev
```

Acesse no navegador:
- **Landing Page Institucional:** `http://localhost:5173/`
- **Tela de Login do App (Protótipo):** `http://localhost:5173/app/login` (ou clique em **"Entrar no Sistema"** no menu superior)
- **Painel Principal do App (Protótipo):** `http://localhost:5173/app`
