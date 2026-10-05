/** Cliente HTTP único: token, envelope de erro e logout no 401. */

const BASE = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000").replace(/\/$/, "")
const CHAVE_TOKEN = "estoque.token"

export class ErroDaApi extends Error {
  status: number
  codigo: string
  campo: string | null

  constructor(status: number, codigo: string, mensagem: string, campo: string | null) {
    super(mensagem)
    this.name = "ErroDaApi"
    this.status = status
    this.codigo = codigo
    this.campo = campo
  }
}

export const token = {
  ler(): string | null {
    try {
      return localStorage.getItem(CHAVE_TOKEN)
    } catch {
      return null
    }
  },
  gravar(valor: string) {
    localStorage.setItem(CHAVE_TOKEN, valor)
  },
  limpar() {
    localStorage.removeItem(CHAVE_TOKEN)
  },
}

let aoDeslogar: () => void = () => {}

/** Chamado quando a API recusa o token (401): a sessão acabou. */
export function definirAoDeslogar(fn: () => void) {
  aoDeslogar = fn
}

type Query = Record<string, string | number | boolean | null | undefined>

function montarUrl(caminho: string, query?: Query): string {
  const url = new URL(BASE + caminho)
  for (const [chave, valor] of Object.entries(query ?? {})) {
    if (valor !== undefined && valor !== null && valor !== "") url.searchParams.set(chave, String(valor))
  }
  return url.toString()
}

async function requisitar<T>(metodo: string, caminho: string, opcoes: { corpo?: unknown; query?: Query } = {}): Promise<T> {
  const atual = token.ler()
  const headers: Record<string, string> = {}
  if (atual) headers.Authorization = `Bearer ${atual}`
  if (opcoes.corpo !== undefined) headers["Content-Type"] = "application/json"

  let resposta: Response
  try {
    resposta = await fetch(montarUrl(caminho, opcoes.query), {
      method: metodo,
      headers,
      body: opcoes.corpo === undefined ? undefined : JSON.stringify(opcoes.corpo),
    })
  } catch {
    throw new ErroDaApi(0, "REDE", "Não foi possível falar com a API. Ela está rodando?", null)
  }

  if (resposta.status === 204) return undefined as T
  const corpo = await resposta.json().catch(() => null)
  if (!resposta.ok) {
    // Só desloga se havia sessão: 401 no login é senha errada, não sessão expirada.
    if (resposta.status === 401 && atual) {
      token.limpar()
      aoDeslogar()
    }
    const erro = corpo?.erro
    throw new ErroDaApi(
      resposta.status,
      erro?.codigo ?? `HTTP-${resposta.status}`,
      erro?.mensagem ?? "Erro inesperado na API.",
      erro?.campo ?? null,
    )
  }
  return corpo as T
}

export const api = {
  get: <T>(caminho: string, query?: Query) => requisitar<T>("GET", caminho, { query }),
  post: <T>(caminho: string, corpo?: unknown) => requisitar<T>("POST", caminho, { corpo }),
  put: <T>(caminho: string, corpo: unknown) => requisitar<T>("PUT", caminho, { corpo }),
  delete: (caminho: string) => requisitar<void>("DELETE", caminho),
}
