import { toast } from "sonner"
import { ErroDaApi } from "@/api/cliente"

export interface ErroCampo {
  campo: string | null
  mensagem: string
}

/** Mostra o erro da API num toast e devolve o campo para o formulário destacar. */
export function tratarErro(e: unknown): ErroCampo {
  const mensagem = e instanceof ErroDaApi ? e.message : "Erro inesperado."
  toast.error(mensagem)
  return { campo: e instanceof ErroDaApi ? e.campo : null, mensagem }
}

export function erroDo(campo: string, erro: ErroCampo | null): string | undefined {
  return erro?.campo === campo ? erro.mensagem : undefined
}
