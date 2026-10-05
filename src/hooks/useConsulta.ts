import { useEffect, useState } from "react"
import { ErroDaApi } from "@/api/cliente"

function comoErro(e: unknown): ErroDaApi {
  return e instanceof ErroDaApi ? e : new ErroDaApi(0, "DESCONHECIDO", "Erro inesperado.", null)
}

/** Carrega dados quando `deps` mudam. `carregando` sai da chave, sem setState síncrono no efeito. */
export function useConsulta<T>(carregar: () => Promise<T>, deps: unknown[]) {
  const [versao, setVersao] = useState(0)
  const chave = JSON.stringify([deps, versao])
  const [resultado, setResultado] = useState<{ chave: string; dados: T | null; erro: ErroDaApi | null }>({
    chave: "",
    dados: null,
    erro: null,
  })

  useEffect(() => {
    let vivo = true
    carregar().then(
      (dados) => vivo && setResultado({ chave, dados, erro: null }),
      (e) => vivo && setResultado((r) => ({ chave, dados: r.dados, erro: comoErro(e) })),
    )
    return () => {
      vivo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave])

  return {
    dados: resultado.dados,
    erro: resultado.chave === chave ? resultado.erro : null,
    carregando: resultado.chave !== chave,
    recarregar: () => setVersao((v) => v + 1),
  }
}
