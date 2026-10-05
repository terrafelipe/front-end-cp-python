import { useState } from "react"
import { toast } from "sonner"
import { api, ErroDaApi } from "@/api/cliente"
import type { Relatorio } from "@/api/tipos"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useConsulta } from "@/hooks/useConsulta"
import { tratarErro } from "@/lib/erros"
import { dataHora } from "@/lib/formato"

/** Último relatório salvo (sem chamar a LLM) e o botão que gera um novo. */
async function ultimo(): Promise<Relatorio | null> {
  try {
    return await api.get<Relatorio>("/relatorios/reposicao/ultimo")
  } catch (e) {
    if (e instanceof ErroDaApi && e.status === 404) return null
    throw e
  }
}

export function RelatorioCard() {
  const salvo = useConsulta(ultimo, [])
  const [novo, setNovo] = useState<Relatorio | null>(null)
  const [gerando, setGerando] = useState(false)
  const relatorio = novo ?? salvo.dados

  async function gerar() {
    setGerando(true)
    try {
      setNovo(await api.post<Relatorio>("/relatorios/reposicao"))
      toast.success("Análise gerada.")
    } catch (e) {
      tratarErro(e)
    } finally {
      setGerando(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="text-base">Análise de reposição</CardTitle>
        <Button onClick={gerar} disabled={gerando}>{gerando ? "Gerando análise…" : "Gerar análise"}</Button>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        {salvo.carregando && !novo && <p className="text-muted-foreground">Carregando…</p>}
        {!salvo.carregando && !relatorio && <p className="text-muted-foreground">Nenhuma análise gerada ainda.</p>}
        {relatorio && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={relatorio.origem === "LLM" ? "default" : "secondary"}>
                {relatorio.origem === "LLM" ? "gerado por IA" : "gerado por regras"}
              </Badge>
              <span className="text-muted-foreground">
                {dataHora(relatorio.criado_em)}{relatorio.modelo ? ` · ${relatorio.modelo}` : ""}
              </span>
            </div>
            <p>{relatorio.resultado.resumo}</p>
            <ol className="grid gap-2">
              {relatorio.resultado.prioridades.map((p, i) => (
                <li key={p.sku} className="rounded-md border p-2">
                  <p className="font-medium">{i + 1}. {p.nome} <span className="text-muted-foreground">({p.sku})</span> — comprar {p.quantidade_sugerida}</p>
                  <p className="text-muted-foreground">{p.motivo}</p>
                </li>
              ))}
            </ol>
          </>
        )}
      </CardContent>
    </Card>
  )
}
