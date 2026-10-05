import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import { api } from "@/api/cliente"
import type { Pagina, Produto } from "@/api/tipos"
import { useSessao } from "@/auth/AuthContext"
import { ConfirmarAcao } from "@/components/ConfirmarAcao"
import { EstadoLista } from "@/components/EstadoLista"
import { Paginacao } from "@/components/Paginacao"
import { ProdutoDialogo } from "@/components/produtos/ProdutoDialogo"
import { Selecao } from "@/components/Selecao"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCatalogo } from "@/hooks/useCatalogo"
import { useConsulta } from "@/hooks/useConsulta"
import { tratarErro } from "@/lib/erros"
import { dinheiro } from "@/lib/formato"

export default function Produtos() {
  const { ehAdmin } = useSessao()
  const { categorias, fornecedores } = useCatalogo()
  const [texto, setTexto] = useState("")
  const [filtros, setFiltros] = useState({ busca: "", categoria_id: "", em_ruptura: "", pagina: 1 })
  const lista = useConsulta(
    () => api.get<Pagina<Produto>>("/produtos", { ...filtros, por_pagina: 20 }),
    [filtros],
  )
  const nomeCategoria = (id: number) => categorias.find((c) => c.id === id)?.nome ?? "—"

  function buscar(e: FormEvent) {
    e.preventDefault()
    setFiltros({ ...filtros, busca: texto, pagina: 1 })
  }

  async function inativar(p: Produto) {
    try {
      await api.delete(`/produtos/${p.id}`)
      toast.success(`${p.nome} inativado.`)
      lista.recarregar()
    } catch (e) {
      tratarErro(e)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <ProdutoDialogo categorias={categorias} fornecedores={fornecedores} aoSalvar={lista.recarregar} gatilho={<Button>Novo produto</Button>} />
      </div>
      <form onSubmit={buscar} className="grid gap-2 sm:grid-cols-[1fr_200px_180px_auto]">
        <Input placeholder="Buscar por nome ou SKU" aria-label="Buscar" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <Selecao aria-label="Filtrar por categoria" value={filtros.categoria_id} onChange={(e) => setFiltros({ ...filtros, categoria_id: e.target.value, pagina: 1 })}>
          <option value="">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </Selecao>
        <Selecao aria-label="Ruptura" value={filtros.em_ruptura} onChange={(e) => setFiltros({ ...filtros, em_ruptura: e.target.value, pagina: 1 })}>
          <option value="">Todos</option>
          <option value="true">Em ruptura</option>
          <option value="false">Abastecidos</option>
        </Selecao>
        <Button type="submit" variant="outline">Buscar</Button>
      </form>
      <EstadoLista carregando={lista.carregando} erro={lista.erro} vazio={lista.dados?.total === 0} mensagemVazia="Nenhum produto encontrado." aoTentarDeNovo={lista.recarregar}>
        {lista.dados && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead><TableHead>Nome</TableHead><TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Saldo</TableHead><TableHead className="text-right">Mínimo</TableHead>
                    <TableHead className="text-right">Preço</TableHead><TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lista.dados.itens.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                      <TableCell>{p.nome} {p.em_ruptura && <Badge variant="destructive" className="ml-1">ruptura</Badge>}</TableCell>
                      <TableCell>{nomeCategoria(p.categoria_id)}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.saldo}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.estoque_minimo}</TableCell>
                      <TableCell className="text-right tabular-nums">{dinheiro(p.preco_venda)}</TableCell>
                      <TableCell className="flex gap-1">
                        <ProdutoDialogo produto={p} categorias={categorias} fornecedores={fornecedores} aoSalvar={lista.recarregar} gatilho={<Button size="sm" variant="outline">Editar</Button>} />
                        <Button size="sm" variant="ghost" nativeButton={false} render={<Link to={`/produtos/${p.id}`} />}>Histórico</Button>
                        {ehAdmin && (
                          <ConfirmarAcao
                            titulo={`Inativar ${p.nome}?`}
                            descricao="O produto sai das listas e não aceita movimentações. O histórico é mantido."
                            rotulo="Inativar" aoConfirmar={() => inativar(p)}
                            gatilho={<Button size="sm" variant="ghost">Inativar</Button>}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Paginacao pagina={lista.dados.pagina} totalPaginas={lista.dados.total_paginas} total={lista.dados.total} aoMudar={(pagina) => setFiltros({ ...filtros, pagina })} />
          </>
        )}
      </EstadoLista>
    </div>
  )
}
