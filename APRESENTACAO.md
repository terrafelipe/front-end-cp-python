# Apresentação do CP2: passo a passo

Deck: https://claude.ai/artifact/GbDscpZgwXzz8z4wKJNWeZ (10 slides, falas nas notas de cada slide).

## Antes da apresentação (uma vez)

1. Compartilhar o deck com o grupo: menu **Share** da página do deck. Sem isso, só você abre o link.
2. Dividir as falas: abertura (slides 1–2), técnica (3–4), produto (5–8), qualidade (9–10).
3. Ensaiar uma vez cronometrando, com meta de ~5 min.
4. Baixar um PDF do deck (Share › Export) como plano B, caso falte internet.

## No dia: só slides (o plano)

1. Abrir o link do deck e entrar no modo **Present**.
2. Nada mais: não precisa subir back, front nem rodar o seed.

## No dia: se for mostrar o sistema ao vivo (opcional)

Num terminal (PowerShell), o back:

```powershell
cd C:\dev\cp-python\backend
.\.venv\Scripts\python.exe seed.py --recriar   # dados de demonstração limpos e com datas de hoje
.\.venv\Scripts\python.exe app.py              # API em http://127.0.0.1:5000 (deixe aberto)
```

Noutro terminal, o front:

```powershell
cd C:\dev\cp-python\frontend
npm run dev                                    # http://localhost:5173 (deixe aberto)
```

Abra http://localhost:5173 e entre com `admin@demo.com` / `admin123`. Para mostrar o operador, use
`operador@demo.com` / `operador123`.

- **"Gerar análise" saiu "gerado por regras"?** A Groq falhou ou está sem chave. Não é erro: é o plano B
  do projeto, e vale explicar isso na hora.
- **Tela em branco ou erro de rede?** Confira se os dois terminais continuam abertos.
- **Números diferentes dos slides?** Rode o `seed.py --recriar` de novo, com o back fechado.

## Depois

Feche os dois terminais (Ctrl+C em cada um). Se o back continuar respondendo em
http://127.0.0.1:5000, sobrou processo: feche-o pelo Gerenciador de Tarefas (`python.exe`) ou peça ao Claude.
