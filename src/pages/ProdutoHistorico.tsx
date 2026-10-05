import { useState } from "react"
import { Link, useParams } from "react-router"
import { api } from "@/api/cliente"
import type { Movimentacao, Pagina, Produto } from "@/api/tipos"
import { EstadoLista } from "@/components/EstadoLista"
import { Paginacao } from "@/components/Paginacao"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useConsulta } from "@/hooks/useConsulta"
import { dataHora, dinheiro, ROTULO_TIPO } from "@/lib/formato"

export default function ProdutoHistorico() {
  const { id } = useParams()
  const [pagina, setPagina] = useState(1)
  const produto = useConsulta(() => api.get<Produto>(`/produtos/${id}`), [id])
  const movs = useConsulta(
    () => api.get<Pagina<Movimentacao>>(`/produtos/${id}/movimentacoes`, { pagina, por_pagina: 20 }),
    [id, pagina],
  )
  const p = produto.dados

  return (
    <div className="grid gap-4">
      <Link to="/produtos" className="text-sm underline">← Produtos</Link>
      <h1 className="text-2xl font-semibold">{p ? `${p.nome} (${p.sku})` : "Histórico do produto"}</h1>
      {p && <p className="text-sm text-muted-foreground">Saldo {p.saldo} · mínimo {p.estoque_minimo} · custo médio {dinheiro(p.preco_custo)}</p>}
      <EstadoLista carregando={movs.carregando} erro={movs.erro ?? produto.erro} vazio={movs.dados?.total === 0} mensagemVazia="Sem movimentações." aoTentarDeNovo={movs.recarregar}>
        {movs.dados && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Qtd.</TableHead><TableHead className="text-right">Custo</TableHead><TableHead>Motivo</TableHead></TableRow></TableHeader>
                <TableBody>
                  {movs.dados.itens.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{dataHora(m.criado_em)}</TableCell>
                      <TableCell>{ROTULO_TIPO[m.tipo]}</TableCell>
                      <TableCell className="text-right tabular-nums">{m.quantidade}</TableCell>
                      <TableCell className="text-right tabular-nums">{m.custo_unitario ? dinheiro(m.custo_unitario) : "—"}</TableCell>
                      <TableCell>{m.motivo ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Paginacao pagina={movs.dados.pagina} totalPaginas={movs.dados.total_paginas} total={movs.dados.total} aoMudar={setPagina} />
          </>
        )}
      </EstadoLista>
    </div>
  )
}
