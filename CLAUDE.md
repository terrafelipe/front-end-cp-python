# Gestor de Estoque (web): front React do checkpoint de Python da FIAP, consome a API do grupo

@../backend/docs/GRUPO.md

## Por quê / escopo
- Interface para operar o estoque: login, dashboard, produtos, movimentações, categorias,
  fornecedores e usuários. SPEC da entrega: `../backend/docs/SPEC-CP2.md`.
- **Fora de escopo:** deploy, Docker, i18n (só pt-BR), PWA/offline, regra de negócio no front.

## Stack e estrutura
- React + Vite + TypeScript, Tailwind + shadcn/ui, React Router, Recharts. Node 24.
- `src/api/` cliente HTTP único (token, envelope de erro, 401) · `src/pages/` uma pasta por tela ·
  `src/components/ui/` gerado pelo shadcn (não editar à mão sem motivo) · `e2e/` Playwright (pytest).

## Comandos
- Setup: `npm install` · Rodar: `npm run dev` (http://localhost:5173; back em :5000)
- Checagem: `npm run lint; npm run build`
- E2E (back e front de pé): ver `e2e/README.md` quando existir

## Regras do projeto
- Toda chamada passa pelo cliente de `src/api/`; nunca `fetch` solto em componente.
- Tipos da API em `src/api/tipos.ts`, espelhando o Swagger; mudou o back, muda aqui.
- Regra de negócio fica no back: o front só esconde menu por papel, o back revalida.
- Toda operação mostra toast de sucesso; erro mostra `erro.mensagem` e destaca `erro.campo`.
- Toda lista tem estado carregando, vazio e erro.
- Nunca `dangerouslySetInnerHTML`; nada de segredo no front (só `VITE_API_URL`).
- Textos da interface em pt-BR; commits pequenos, assunto sem acento; push só com ok do Felipe.

## Como trabalhar aqui
- Retomar o trabalho: `/briefing`. SPEC e contrato moram no back (`../backend/docs/`).
- Plano do front ainda não existe: gerar com `superpowers:writing-plans` (F1–F8 da SPEC) quando o
  back fechar (D2), em `../backend/docs/superpowers/plans/`.
- Tarefa que também mexe no back: abrir a sessão no back com `/add-dir ../frontend`.
- E2E com Playwright roda pelo Claude, não pelo Codex (o sandbox do Codex bloqueia o Playwright no Windows).
- Fechou tarefa: atualizar o Status do card no Notion "Tarefas do CP2" (com ok do Felipe) e a ficha.

## Armadilhas
- Variável de ambiente só chega ao código com prefixo `VITE_`; mudou `.env`, reiniciar o `npm run dev`.
- Token fica no `localStorage` (decisão D9 da SPEC): qualquer HTML cru vira roubo de sessão.
- Erro de CORS = origem fora de `CORS_ORIGINS` no back (usar a porta 5173).
