# Gestor de Estoque — Front-end (CP2)

Interface web do Gestor de Estoque (checkpoint de Python, FIAP). Consome a API Flask do repositório
[back-end-cp-python](https://github.com/terrafelipe/back-end-cp-python).

## Integrantes

| Nome | RM | GitHub |
|---|---|---|
| Felipe Terra | RM569324 | [@terrafelipe](https://github.com/terrafelipe) |
| Gustavo Pugas Linczuk | RM573087 | [@gulinczuk](https://github.com/gulinczuk) |
| Leonardo Bueno | RM572152 | [@leonardobueno1102-droid](https://github.com/leonardobueno1102-droid) |
| João Vitor Veiga | RM569874 | [@JonisMaxWin](https://github.com/JonisMaxWin) |
| Danilo Kheiti | RM574137 | [@DaniloKeithi](https://github.com/DaniloKeithi) |

## Stack

React 19 + Vite + TypeScript, Tailwind 4 + shadcn/ui, React Router, Recharts, sonner.

## Telas

| Rota | Tela | Quem vê |
|---|---|---|
| `/login`, `/cadastro` | Entrar e cadastrar empresa | todos |
| `/` | Dashboard: KPIs, entradas × saídas, valor por categoria, top 5 saídas, alertas e análise de reposição (IA ou regras) | logado |
| `/produtos`, `/produtos/:id` | Lista com busca e filtros, cadastro em diálogo, inativar, histórico | logado (preço e inativar: ADMIN) |
| `/movimentacoes` | Entrada, saída e ajuste; extrato com filtros | logado |
| `/categorias` | Cadastro de categorias | logado |
| `/fornecedores`, `/usuarios` | Cadastros de apoio | ADMIN |

## Integração com a API

Toda chamada passa por `src/api/cliente.ts`: injeta o token (guardado no `localStorage`), converte o
envelope `{"erro": {"codigo", "mensagem", "campo"}}` em `ErroDaApi` e, num 401 com sessão aberta,
limpa o token e volta ao login. Erros aparecem em toast e destacam o campo indicado pela API.
O dashboard inteiro vem de `GET /dashboard/resumo` numa requisição. Contrato: `docs/GRUPO.md` do back.

## Como rodar

Pré-requisito: a API rodando em `http://127.0.0.1:5000` (ver README do back: `seed.py` e `app.py`).

```powershell
Copy-Item .env.example .env
npm install
npm run dev        # http://localhost:5173
```

Usuários de demonstração: `admin@demo.com` / `admin123` e `operador@demo.com` / `operador123`.

## Checagens

```powershell
npm run lint; npm run build; npm test
```

E2E: ver `e2e/README.md`.
