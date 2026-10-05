"""E2E contra back e front locais.

Pré-requisitos (ver e2e/README.md): back com `seed.py --recriar` rodando em
:5000 e `npm run dev` em :5173.
"""

import os

import pytest
from playwright.sync_api import Page, expect

URL_FRONT = os.getenv("E2E_URL_FRONT", "http://localhost:5173")


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {**browser_context_args, "base_url": URL_FRONT, "locale": "pt-BR"}


def entrar(page: Page, email: str, senha: str) -> None:
    page.goto("/login")
    page.get_by_label("E-mail").fill(email)
    page.get_by_label("Senha").fill(senha)
    page.get_by_role("button", name="Entrar").click()
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()


@pytest.fixture
def admin(page: Page) -> Page:
    entrar(page, "admin@demo.com", "admin123")
    return page
