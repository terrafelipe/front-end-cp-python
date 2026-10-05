import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { api, definirAoDeslogar, ErroDaApi, token } from "./cliente"

function responder(status: number, corpo?: unknown) {
  const fetchFalso = vi.fn().mockResolvedValue(
    new Response(corpo === undefined ? null : JSON.stringify(corpo), { status }),
  )
  vi.stubGlobal("fetch", fetchFalso)
  return fetchFalso
}

describe("cliente da API", () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it("injeta o token e monta a query sem valores vazios", async () => {
    token.gravar("abc")
    const fetchFalso = responder(200, { ok: true })
    await api.get("/produtos", { pagina: 2, busca: "", categoria_id: undefined, em_ruptura: true })
    const [url, init] = fetchFalso.mock.calls[0]
    expect(url).toBe("http://127.0.0.1:5000/produtos?pagina=2&em_ruptura=true")
    expect(init.headers.Authorization).toBe("Bearer abc")
  })

  it("converte o envelope de erro em ErroDaApi com o campo", async () => {
    responder(422, { erro: { codigo: "RN-02", mensagem: "Saída excede o saldo.", campo: "quantidade" } })
    const erro = (await api.post("/movimentacoes", {}).catch((e) => e)) as ErroDaApi
    expect(erro).toBeInstanceOf(ErroDaApi)
    expect(erro).toMatchObject({ status: 422, codigo: "RN-02", message: "Saída excede o saldo.", campo: "quantidade" })
  })

  it("401 com token limpa a sessão e avisa", async () => {
    token.gravar("velho")
    const aviso = vi.fn()
    definirAoDeslogar(aviso)
    responder(401, { erro: { codigo: "HTTP-401", mensagem: "Token expirado.", campo: null } })
    await api.get("/auth/me").catch(() => {})
    expect(token.ler()).toBeNull()
    expect(aviso).toHaveBeenCalledOnce()
  })

  it("401 atrasado de um token antigo não derruba a sessão nova", async () => {
    token.gravar("velho")
    const aviso = vi.fn()
    definirAoDeslogar(aviso)
    let responderDepois: (r: Response) => void = () => {}
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise<Response>((r) => { responderDepois = r })))
    const pedido = api.get("/produtos").catch(() => {})
    token.gravar("novo")
    responderDepois(new Response(JSON.stringify({ erro: { codigo: "HTTP-401", mensagem: "Token expirado.", campo: null } }), { status: 401 }))
    await pedido
    expect(token.ler()).toBe("novo")
    expect(aviso).not.toHaveBeenCalled()
  })

  it("401 sem token (senha errada no login) não dispara o aviso", async () => {
    const aviso = vi.fn()
    definirAoDeslogar(aviso)
    responder(401, { erro: { codigo: "HTTP-401", mensagem: "E-mail ou senha inválidos.", campo: null } })
    const erro = (await api.post("/auth/login", {}).catch((e) => e)) as ErroDaApi
    expect(erro.message).toBe("E-mail ou senha inválidos.")
    expect(aviso).not.toHaveBeenCalled()
  })

  it("API fora do ar vira mensagem clara", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))
    const erro = (await api.get("/health").catch((e) => e)) as ErroDaApi
    expect(erro).toMatchObject({ status: 0, codigo: "REDE" })
    expect(erro.message).toContain("Ela está rodando?")
  })

  it("204 devolve undefined", async () => {
    responder(204)
    await expect(api.delete("/produtos/1")).resolves.toBeUndefined()
  })
})
