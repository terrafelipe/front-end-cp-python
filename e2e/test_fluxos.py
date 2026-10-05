import time

from playwright.sync_api import Page, expect

from conftest import entrar


def _sku() -> str:
    return f"E2E-{int(time.time() * 1000)}"


def test_login_leva_ao_dashboard(admin: Page):
    expect(admin.get_by_role("link", name="Usuários")).to_be_visible()


def test_dashboard_mostra_numeros_do_seed(admin: Page):
    expect(admin.get_by_test_id("kpi-em_ruptura")).to_contain_text("3")
    expect(admin.get_by_test_id("kpi-produtos_ativos")).not_to_contain_text("0")
    expect(admin.get_by_text("Entradas × saídas por dia")).to_be_visible()


def _criar_produto(page: Page, sku: str) -> None:
    page.get_by_role("link", name="Produtos").click()
    page.get_by_role("button", name="Novo produto").click()
    page.get_by_label("SKU").fill(sku)
    page.get_by_label("Nome").fill(f"Produto {sku}")
    page.get_by_label("Categoria", exact=True).select_option(index=1)
    page.get_by_role("button", name="Salvar").click()
    expect(page.get_by_text("Produto criado.")).to_be_visible()


def test_criar_produto(admin: Page):
    sku = _sku()
    _criar_produto(admin, sku)
    admin.get_by_label("Buscar").fill(sku)
    admin.get_by_role("button", name="Buscar").click()
    expect(admin.get_by_role("cell", name=sku, exact=True)).to_be_visible()


def test_saida_acima_do_saldo_mostra_rn02(admin: Page):
    sku = _sku()
    _criar_produto(admin, sku)
    admin.get_by_role("link", name="Movimentações").click()
    admin.get_by_label("Produto", exact=True).select_option(label=f"{sku} — Produto {sku} (saldo 0)")
    admin.get_by_label("Tipo", exact=True).select_option("SAIDA")
    admin.get_by_label("Quantidade").fill("5")
    admin.get_by_role("button", name="Registrar").click()
    expect(admin.get_by_text("excede o saldo disponível de 0 unidades").first).to_be_visible()


def test_operador_nao_ve_usuarios(page: Page):
    entrar(page, "operador@demo.com", "operador123")
    expect(page.get_by_role("link", name="Produtos")).to_be_visible()
    expect(page.get_by_role("link", name="Usuários")).to_have_count(0)
    page.goto("/usuarios")
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()


def test_celular_abre_menu_em_gaveta(page: Page):
    page.set_viewport_size({"width": 390, "height": 844})
    entrar(page, "admin@demo.com", "admin123")
    page.get_by_role("button", name="Abrir menu").click()
    page.get_by_role("dialog").get_by_role("link", name="Produtos").click()
    expect(page.get_by_role("heading", name="Produtos")).to_be_visible()
