import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { api, definirAoDeslogar, ErroDaApi, token } from "@/api/cliente"
import type { Token, Usuario } from "@/api/tipos"

export interface Registro {
  empresa: string
  cnpj: string
  nome: string
  email: string
  senha: string
}

interface Sessao {
  usuario: Usuario | null
  carregando: boolean
  ehAdmin: boolean
  entrar(email: string, senha: string): Promise<void>
  registrar(dados: Registro): Promise<void>
  sair(): void
  atualizar(): Promise<void>
}

const Contexto = createContext<Sessao | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(() => token.ler() !== null)

  useEffect(() => {
    definirAoDeslogar(() => {
      setUsuario(null)
      toast.error("Sessão expirada. Entre de novo.")
    })
    if (!token.ler()) return
    // Token salvo pode estar velho (back recriado): /auth/me decide. Um 401
    // já limpa o token no cliente; rede ou 500 mantêm o token para o próximo F5.
    api.get<Usuario>("/auth/me")
      .then(setUsuario, (e) => {
        if (!(e instanceof ErroDaApi && e.status === 401)) toast.error(e instanceof ErroDaApi ? e.message : "Erro ao carregar a sessão.")
      })
      .finally(() => setCarregando(false))
  }, [])

  function guardar(resposta: Token) {
    token.gravar(resposta.access_token)
    setUsuario(resposta.usuario)
  }

  const valor: Sessao = {
    usuario,
    carregando,
    ehAdmin: usuario?.role === "ADMIN",
    entrar: async (email, senha) => guardar(await api.post<Token>("/auth/login", { email, senha })),
    registrar: async (dados) => guardar(await api.post<Token>("/auth/register", dados)),
    atualizar: async () => setUsuario(await api.get<Usuario>("/auth/me")),
    sair: () => {
      token.limpar()
      setUsuario(null)
    },
  }
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSessao(): Sessao {
  const sessao = useContext(Contexto)
  if (!sessao) throw new Error("useSessao fora do AuthProvider")
  return sessao
}
