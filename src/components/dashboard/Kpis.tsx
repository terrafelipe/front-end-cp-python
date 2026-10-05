import type { ResumoDashboard } from "@/api/tipos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dinheiro } from "@/lib/formato"

export function Kpis({ kpis }: { kpis: ResumoDashboard["kpis"] }) {
  const itens = [
    { chave: "valor_estoque", rotulo: "Valor em estoque", valor: dinheiro(kpis.valor_estoque) },
    { chave: "produtos_ativos", rotulo: "Produtos ativos", valor: String(kpis.produtos_ativos) },
    { chave: "em_ruptura", rotulo: "Em ruptura", valor: String(kpis.em_ruptura) },
    { chave: "movimentacoes", rotulo: "Movimentações no período", valor: String(kpis.movimentacoes) },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {itens.map((k) => (
        <Card key={k.chave} data-testid={`kpi-${k.chave}`}>
          <CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">{k.rotulo}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold tabular-nums">{k.valor}</p></CardContent>
        </Card>
      ))}
    </div>
  )
}
