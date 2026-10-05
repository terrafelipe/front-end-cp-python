import type { ReactNode } from "react"
import type { ErroDaApi } from "@/api/cliente"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  carregando: boolean
  erro: ErroDaApi | null
  vazio: boolean
  mensagemVazia: string
  aoTentarDeNovo: () => void
  children: ReactNode
}

export function EstadoLista({ carregando, erro, vazio, mensagemVazia, aoTentarDeNovo, children }: Props) {
  if (carregando) {
    return (
      <div className="grid gap-2" aria-busy="true">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-9 w-full" />)}
      </div>
    )
  }
  if (erro) {
    return (
      <div role="alert" className="rounded-md border border-destructive/40 p-4 text-sm">
        <p>{erro.message}</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={aoTentarDeNovo}>Tentar de novo</Button>
      </div>
    )
  }
  if (vazio) return <p className="py-8 text-center text-sm text-muted-foreground">{mensagemVazia}</p>
  return <>{children}</>
}
