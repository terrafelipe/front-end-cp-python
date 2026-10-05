import { useState } from "react"
import { api } from "@/api/cliente"
import type { ResumoDashboard } from "@/api/tipos"
import { EntradasSaidas, TopSaidas, ValorPorCategoria } from "@/components/dashboard/Graficos"
import { Kpis } from "@/components/dashboard/Kpis"
import { RelatorioCard } from "@/components/dashboard/RelatorioCard"
import { EstadoLista } from "@/components/EstadoLista"
import { Selecao } from "@/components/Selecao"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useConsulta } from "@/hooks/useConsulta"

export default function Dashboard() {
  const [dias, setDias] = useState(30)
  const resumo = useConsulta(() => api.get<ResumoDashboard>("/dashboard/resumo", { dias }), [dias])
  const r = resumo.dados

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <label className="flex items-center gap-2 text-sm">
          Período
          <Selecao className="w-32" value={dias} onChange={(e) => setDias(Number(e.target.value))}>
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
          </Selecao>
        </label>
      </div>
      <EstadoLista carregando={resumo.carregando} erro={resumo.erro} vazio={false} mensagemVazia="" aoTentarDeNovo={resumo.recarregar}>
        {r && (
          <>
            <Kpis kpis={r.kpis} />
            <div className="grid gap-4 lg:grid-cols-2">
              <EntradasSaidas serie={r.serie_diaria} />
              <ValorPorCategoria dados={r.valor_por_categoria} />
              <TopSaidas dados={r.top_saidas} />
              <Card>
                <CardHeader><CardTitle className="text-base">Alertas de ruptura</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  {r.alertas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum produto abaixo do mínimo.</p>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead className="text-right">Saldo</TableHead><TableHead className="text-right">Mínimo</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {r.alertas.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>{p.nome} <Badge variant="destructive" className="ml-1">ruptura</Badge></TableCell>
                            <TableCell className="text-right tabular-nums">{p.saldo}</TableCell>
                            <TableCell className="text-right tabular-nums">{p.estoque_minimo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </EstadoLista>
      <RelatorioCard />
    </div>
  )
}
