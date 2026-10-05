import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { api } from "@/api/cliente"
import type { Movimentacao, Pagina, Produto, TipoMovimentacao } from "@/api/tipos"
import { Campo } from "@/components/Campo"
import { EstadoLista } from "@/components/EstadoLista"
import { Paginacao } from "@/components/Paginacao"
import { Selecao } from "@/components/Selecao"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useConsulta } from "@/hooks/useConsulta"
import { erroDo, tratarErro, type ErroCampo } from "@/lib/erros"
import { dataHora, dinheiro, ROTULO_TIPO, semVazios } from "@/lib/formato"

const VAZIO = { produto_id: "", tipo: "ENTRADA" as TipoMovimentacao, quantidade: "", custo_unitario: "", motivo: "" }

export default function Movimentacoes() {
  const produtos = useConsulta(() => api.get<Pagina<Produto>>("/produtos", { por_pagina: 100 }), [])
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState<ErroCampo | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [filtros, setFiltros] = useState({ tipo: "", produto_id: "", de: "", ate: "", pagina: 1 })
  const extrato = useConsulta(
    () => api.get<Pagina<Movimentacao>>("/movimentacoes", {
      ...filtros,
      // A API compara com o instante: só a data cortaria o próprio dia final.
      ate: filtros.ate ? `${filtros.ate}T23:59:59` : "",
      por_pagina: 20,
    }),
    [filtros],
  )
  const lista = produtos.dados?.itens ?? []
  const nomeProduto = (id: number) => lista.find((p) => p.id === id)?.nome ?? `#${id}`

  async function registrar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await api.post("/movimentacoes", semVazios({
        produto_id: Number(form.produto_id),
        tipo: form.tipo,
        quantidade: Number(form.quantidade),
        // Custo só existe em entrada (RN-07).
        custo_unitario: form.tipo === "ENTRADA" && form.custo_unitario ? Number(form.custo_unitario) : null,
        motivo: form.motivo || null,
      }))
      toast.success(`${ROTULO_TIPO[form.tipo]} registrada.`)
      setForm({ ...VAZIO, produto_id: form.produto_id, tipo: form.tipo })
      setErro(null)
      extrato.recarregar()
      produtos.recarregar()
    } catch (falha) {
      setErro(tratarErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  const selecionado = lista.find((p) => String(p.id) === form.produto_id)

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Movimentações</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">Registrar movimentação</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={registrar} className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <Campo rotulo="Produto" id="produto_id" erro={erroDo("produto_id", erro)}>
              <Selecao id="produto_id" required value={form.produto_id} onChange={(e) => setForm({ ...form, produto_id: e.target.value })} aria-invalid={!!erroDo("produto_id", erro)}>
                <option value="">Selecione…</option>
                {lista.map((p) => <option key={p.id} value={p.id}>{p.sku} — {p.nome} (saldo {p.saldo})</option>)}
              </Selecao>
            </Campo>
            <Campo rotulo="Tipo" id="tipo" erro={erroDo("tipo", erro)}>
              <Selecao id="tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoMovimentacao })}>
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
                <option value="AJUSTE">Ajuste (contagem)</option>
              </Selecao>
            </Campo>
            <Campo rotulo={form.tipo === "AJUSTE" ? "Saldo contado" : "Quantidade"} id="quantidade" erro={erroDo("quantidade", erro)}>
              <Input id="quantidade" type="number" min={1} required value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} aria-invalid={!!erroDo("quantidade", erro)} />
            </Campo>
            {form.tipo === "ENTRADA" ? (
              <Campo rotulo="Custo unitário (R$)" id="custo_unitario" erro={erroDo("custo_unitario", erro)}>
                <Input id="custo_unitario" type="number" step="0.01" min={0} value={form.custo_unitario} onChange={(e) => setForm({ ...form, custo_unitario: e.target.value })} aria-invalid={!!erroDo("custo_unitario", erro)} />
              </Campo>
            ) : <div />}
            <Campo rotulo="Motivo" id="motivo" erro={erroDo("motivo", erro)}>
              <Input id="motivo" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
            </Campo>
            <div className="flex items-end gap-3 md:col-span-3">
              <Button type="submit" disabled={enviando}>{enviando ? "Registrando…" : "Registrar"}</Button>
              {selecionado && <span className="text-sm text-muted-foreground">Saldo atual: {selecionado.saldo}</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:grid-cols-4">
        <Selecao aria-label="Filtrar por tipo" value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value, pagina: 1 })}>
          <option value="">Todos os tipos</option><option value="ENTRADA">Entrada</option><option value="SAIDA">Saída</option><option value="AJUSTE">Ajuste</option>
        </Selecao>
        <Selecao aria-label="Filtrar por produto" value={filtros.produto_id} onChange={(e) => setFiltros({ ...filtros, produto_id: e.target.value, pagina: 1 })}>
          <option value="">Todos os produtos</option>
          {lista.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </Selecao>
        <Input type="date" aria-label="De" value={filtros.de} onChange={(e) => setFiltros({ ...filtros, de: e.target.value, pagina: 1 })} />
        <Input type="date" aria-label="Até" value={filtros.ate} onChange={(e) => setFiltros({ ...filtros, ate: e.target.value, pagina: 1 })} />
      </div>
      <EstadoLista carregando={extrato.carregando} erro={extrato.erro} vazio={extrato.dados?.total === 0} mensagemVazia="Nenhuma movimentação com esses filtros." aoTentarDeNovo={extrato.recarregar}>
        {extrato.dados && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Produto</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Qtd.</TableHead><TableHead className="text-right">Custo</TableHead><TableHead>Motivo</TableHead></TableRow></TableHeader>
                <TableBody>
                  {extrato.dados.itens.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{dataHora(m.criado_em)}</TableCell>
                      <TableCell>{nomeProduto(m.produto_id)}</TableCell>
                      <TableCell>{ROTULO_TIPO[m.tipo]}</TableCell>
                      <TableCell className="text-right tabular-nums">{m.quantidade}</TableCell>
                      <TableCell className="text-right tabular-nums">{m.custo_unitario ? dinheiro(m.custo_unitario) : "—"}</TableCell>
                      <TableCell>{m.motivo ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Paginacao pagina={extrato.dados.pagina} totalPaginas={extrato.dados.total_paginas} total={extrato.dados.total} aoMudar={(pagina) => setFiltros({ ...filtros, pagina })} />
          </>
        )}
      </EstadoLista>
    </div>
  )
}
