"""
tests/conftest.py

Pytest fixtures shared across all tests.
"""

import pytest

# TODO: Add shared fixtures:
#
# @pytest.fixture(scope="session")
# def event_loop():
#     """Create an instance of the default event loop for the test session."""
#     import asyncio
#     loop = asyncio.get_event_loop_policy().new_event_loop()
#     yield loop
#     loop.close()
#
# @pytest.fixture(scope="function")
# async def db():
#     """Provide a clean test database session."""
#     pass
#
# @pytest.fixture
# def client():
#     """Provide a test HTTP client."""
#     from fastapi.testclient import TestClient
#     from app.main import app
#     return TestClient(app)
