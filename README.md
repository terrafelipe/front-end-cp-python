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
