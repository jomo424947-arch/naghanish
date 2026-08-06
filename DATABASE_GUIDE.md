# Database Guide

## Overview

Naghanish uses **PostgreSQL** as its primary database, managed via **SQLAlchemy** ORM and **Alembic** for migrations.

## Connection

```
postgresql://user:password@localhost:5432/naghanish
```

## Schema Domains

### Users
Handles user accounts, profiles, and authentication data.

### Games
Game catalog, categories, and session tracking.

### Quizzes
Quiz definitions, questions, and answer records.

### Party
Room state, participants, and session data.

### Leaderboard
Score snapshots and ranking computation.

### Achievements
Achievement definitions and user unlock records.

### Missions
Daily challenge definitions and completion records.

### Friends
Friend relationships and request states.

### Notifications
Notification events and delivery status.

### Community
User-generated content and interactions.

### Economy
Coins, XP, and transaction ledger.

## Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

## Seeding

```bash
# Run seed scripts
python -m seed.run
```

<!-- TODO: Document full ERD and relationship diagrams -->
