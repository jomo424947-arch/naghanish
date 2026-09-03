# Project Structure

## Overview

This document describes the full directory structure of the Naghanish monorepo.

```
naghanish/
├── README.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── CHANGELOG.md
├── PROJECT_STRUCTURE.md        ← this file
├── API_GUIDE.md
├── DATABASE_GUIDE.md
│
├── frontend/                   # React + TypeScript SPA
│   ├── public/                 # Static assets served as-is
│   ├── .husky/                 # Git hooks
│   ├── src/
│   │   ├── app/                # App shell, root providers wiring
│   │   ├── routes/             # Route definitions & configuration
│   │   ├── layouts/            # Page layout wrappers
│   │   │   ├── AuthLayout/
│   │   │   ├── DashboardLayout/
│   │   │   ├── GameLayout/
│   │   │   └── MinimalLayout/
│   │   ├── pages/              # One folder per page (26 pages)
│   │   ├── components/         # Global reusable UI components
│   │   │   ├── buttons/
│   │   │   ├── cards/
│   │   │   ├── dialogs/
│   │   │   ├── forms/
│   │   │   ├── inputs/
│   │   │   ├── dropdowns/
│   │   │   ├── avatars/
│   │   │   ├── badges/
│   │   │   ├── charts/
│   │   │   ├── tables/
│   │   │   ├── navigation/
│   │   │   ├── sidebar/
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   ├── headers/
│   │   │   ├── loaders/
│   │   │   ├── skeletons/
│   │   │   ├── modals/
│   │   │   ├── toast/
│   │   │   ├── progress/
│   │   │   ├── tabs/
│   │   │   ├── carousel/
│   │   │   └── shared/
│   │   ├── features/           # Feature-sliced modules (17 features)
│   │   │   └── [feature]/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── services/
│   │   │       ├── store/
│   │   │       └── types/
│   │   ├── hooks/              # Global custom hooks
│   │   ├── services/           # Global service layer
│   │   ├── store/              # Zustand global stores
│   │   ├── providers/          # React context providers
│   │   ├── context/            # Raw context definitions
│   │   ├── types/              # Global TypeScript types
│   │   ├── utils/              # Utility functions
│   │   ├── styles/             # Global CSS / Tailwind base
│   │   ├── theme/              # Design system tokens
│   │   │   ├── colors/
│   │   │   ├── spacing/
│   │   │   ├── typography/
│   │   │   ├── tokens/
│   │   │   ├── themes/
│   │   │   └── components/
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   ├── animations/
│   │   │   └── fonts/
│   │   ├── constants/          # App-wide constants
│   │   ├── config/             # Environment & app config
│   │   ├── lib/                # Third-party wrappers
│   │   ├── middlewares/        # Router middlewares
│   │   ├── guards/             # Route guards
│   │   └── api/                # API client & typed endpoints
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   └── package.json
│
└── backend/                    # FastAPI application
    ├── app/
    │   ├── main.py             # Application factory
    │   ├── api/                # HTTP layer
    │   │   ├── router.py       # Aggregates all routers
    │   │   └── routers/        # One router per domain (15 routers)
    │   ├── core/               # Cross-cutting concerns
    │   ├── config/             # Settings & environment
    │   ├── database/           # Engine, session, base model
    │   ├── models/             # SQLAlchemy ORM models
    │   ├── schemas/            # Pydantic request/response schemas
    │   ├── repositories/       # DB access layer (repository pattern)
    │   ├── services/           # Business logic layer
    │   ├── dependencies/       # FastAPI dependency injection
    │   ├── middleware/         # CORS, logging, rate limiting
    │   ├── security/           # JWT, password hashing
    │   ├── auth/               # Authentication flows
    │   ├── websocket/          # WebSocket manager
    │   ├── ai/                 # AI integrations
    │   └── utils/              # Shared utilities
    ├── tests/
    │   ├── unit/
    │   ├── integration/
    │   └── conftest.py
    ├── migrations/             # Alembic migrations
    │   └── versions/
    ├── seed/                   # Database seed scripts
    ├── pyproject.toml
    ├── requirements.txt
    ├── requirements-dev.txt
    ├── alembic.ini
    ├── Makefile
    └── .env.example
```

## Architecture Decisions

<!-- TODO: Document key architectural decisions (ADRs) here -->
