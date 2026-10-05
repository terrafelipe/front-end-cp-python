import { useState, type FormEvent, type ReactElement } from "react"
import { Campo } from "@/components/Campo"
import { Selecao } from "@/components/Selecao"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { erroDo, tratarErro, type ErroCampo } from "@/lib/erros"

export interface DefCampo<T> {
  nome: keyof T & string
  rotulo: string
  tipo?: "text" | "email" | "password" | "select"
  opcoes?: { valor: string; rotulo: string }[]
  obrigatorio?: boolean
}

interface Props<T extends Record<string, string>> {
  titulo: string
  campos: DefCampo<T>[]
  inicial: T
  aoEnviar: (dados: T) => Promise<void>
  gatilho: ReactElement
}

/** Diálogo de formulário simples, para os cadastros de apoio. */
export function DialogoFormulario<T extends Record<string, string>>({ titulo, campos, inicial, aoEnviar, gatilho }: Props<T>) {
  const [aberto, setAberto] = useState(false)
  const [dados, setDados] = useState<T>(inicial)
  const [erro, setErro] = useState<ErroCampo | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await aoEnviar(dados)
      setAberto(false)
    } catch (falha) {
      setErro(tratarErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  function aoMudarAberto(a: boolean) {
    setAberto(a)
    if (a) {
      setDados(inicial)
      setErro(null)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoMudarAberto}>
      <DialogTrigger render={gatilho} />
      <DialogContent>
        <DialogHeader><DialogTitle>{titulo}</DialogTitle></DialogHeader>
        <form onSubmit={enviar} className="grid gap-3">
          {campos.map((c) => (
            <Campo key={c.nome} rotulo={c.rotulo} id={c.nome} erro={erroDo(c.nome, erro)}>
              {c.tipo === "select" ? (
                <Selecao id={c.nome} value={dados[c.nome]} onChange={(e) => setDados({ ...dados, [c.nome]: e.target.value })}>
                  {c.opcoes?.map((o) => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}
                </Selecao>
              ) : (
                <Input
                  id={c.nome} type={c.tipo ?? "text"} required={c.obrigatorio} value={dados[c.nome]}
                  aria-invalid={!!erroDo(c.nome, erro)}
                  onChange={(e) => setDados({ ...dados, [c.nome]: e.target.value })}
                />
              )}
            </Campo>
          ))}
          <DialogFooter><Button type="submit" disabled={enviando}>{enviando ? "Salvando…" : "Salvar"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
