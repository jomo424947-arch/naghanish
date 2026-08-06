# Naghanish

> An AI-powered modern entertainment platform featuring Brain Games, Personality Tests, Party Games, Multiplayer, and more.

## Overview

Naghanish is a next-generation entertainment platform built with a modern full-stack architecture. This repository contains the complete monorepo scaffold for the platform.

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Linting**: ESLint + Prettier + Husky

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Validation**: Pydantic v2

## Repository Structure

```
naghanish/
├── frontend/          # React + TypeScript application
├── backend/           # FastAPI application
└── docs/              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.11
- PostgreSQL >= 15
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) — How to contribute
- [ROADMAP.md](./ROADMAP.md) — Feature roadmap
- [CHANGELOG.md](./CHANGELOG.md) — Version history
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) — Detailed architecture
- [API_GUIDE.md](./API_GUIDE.md) — API documentation guide
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) — Database schema guide

## License

Private — All rights reserved.
