.PHONY: dev install migrate upgrade downgrade test lint format

# ── Development ───────────────────────────────────────────────────────────────
dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

install:
	pip install -r requirements-dev.txt

# ── Database ──────────────────────────────────────────────────────────────────
migrate:
	alembic revision --autogenerate -m "$(msg)"

upgrade:
	alembic upgrade head

downgrade:
	alembic downgrade -1

# ── Testing ───────────────────────────────────────────────────────────────────
test:
	pytest -v --cov=app --cov-report=term-missing

test-unit:
	pytest tests/unit -v

test-integration:
	pytest tests/integration -v

# ── Code Quality ──────────────────────────────────────────────────────────────
lint:
	ruff check .

lint-fix:
	ruff check . --fix

format:
	ruff format .

type-check:
	mypy app
