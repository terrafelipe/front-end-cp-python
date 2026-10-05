import type { ReactElement } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { ResumoDashboard } from "@/api/tipos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataCurta, dinheiro } from "@/lib/formato"

const EIXO = { stroke: "var(--muted-foreground)", fontSize: 12 }

function Painel({ titulo, children, vazio }: { titulo: string; children: ReactElement; vazio: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{titulo}</CardTitle></CardHeader>
      <CardContent className="h-64">
        {vazio
          ? <p className="grid h-full place-items-center text-sm text-muted-foreground">Sem dados no período.</p>
          : <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>}
      </CardContent>
    </Card>
  )
}

export function EntradasSaidas({ serie }: { serie: ResumoDashboard["serie_diaria"] }) {
  const vazio = serie.every((p) => p.entradas === 0 && p.saidas === 0)
  return (
    <Painel titulo="Entradas × saídas por dia" vazio={vazio}>
      <LineChart data={serie}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="data" tickFormatter={dataCurta} minTickGap={16} tick={EIXO} />
        <YAxis allowDecimals={false} width={40} tick={EIXO} />
        <Tooltip labelFormatter={(d) => dataCurta(String(d))} />
        <Legend />
        <Line type="monotone" dataKey="entradas" name="Entradas" stroke="var(--serie-1)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="saidas" name="Saídas" stroke="var(--serie-2)" dot={false} strokeWidth={2} />
      </LineChart>
    </Painel>
  )
}

export function ValorPorCategoria({ dados }: { dados: ResumoDashboard["valor_por_categoria"] }) {
  return (
    <Painel titulo="Valor em estoque por categoria" vazio={dados.length === 0}>
      <BarChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="categoria" tick={EIXO} />
        <YAxis width={70} tick={EIXO} tickFormatter={(v) => dinheiro(v).replace(",00", "")} />
        <Tooltip formatter={(v) => dinheiro(Number(v))} />
        <Bar dataKey="valor" name="Valor" fill="var(--serie-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </Painel>
  )
}

export function TopSaidas({ dados }: { dados: ResumoDashboard["top_saidas"] }) {
  return (
    <Painel titulo="Top 5 saídas no período" vazio={dados.length === 0}>
      <BarChart data={dados} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
        <XAxis type="number" allowDecimals={false} tick={EIXO} />
        <YAxis type="category" dataKey="nome" width={140} tick={EIXO} />
        <Tooltip />
        <Bar dataKey="quantidade" name="Unidades" fill="var(--serie-2)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </Painel>
  )
}
