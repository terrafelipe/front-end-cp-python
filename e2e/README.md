# E2E (pytest-playwright)

Seis fluxos: login, números do dashboard, criar produto, saída acima do saldo (RN-02),
operador sem menu de usuários e menu em gaveta no celular.

```powershell
# uma vez
python -m venv e2e\.venv
e2e\.venv\Scripts\python.exe -m pip install -r e2e\requirements.txt
e2e\.venv\Scripts\python.exe -m playwright install chromium

# a cada rodada: back com seed novo em :5000 e front em :5173, depois
e2e\.venv\Scripts\python.exe -m pytest -q
```

O teste de números espera o seed recém-criado (`seed.py --recriar`): 3 produtos em ruptura.
Cada rodada cria produtos `E2E-...` na empresa demo; recriar o seed antes de apresentar.
