import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/api/cliente"
import type { Categoria, Pagina } from "@/api/tipos"
import { ConfirmarAcao } from "@/components/ConfirmarAcao"
import { DialogoFormulario, type DefCampo } from "@/components/DialogoFormulario"
import { EstadoLista } from "@/components/EstadoLista"
import { Paginacao } from "@/components/Paginacao"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useConsulta } from "@/hooks/useConsulta"
import { tratarErro } from "@/lib/erros"

const CAMPOS: DefCampo<{ nome: string }>[] = [{ nome: "nome", rotulo: "Nome", obrigatorio: true }]

export default function Categorias() {
  const [pagina, setPagina] = useState(1)
  const lista = useConsulta(() => api.get<Pagina<Categoria>>("/categorias", { pagina, por_pagina: 20 }), [pagina])

  async function excluir(c: Categoria) {
    try {
      await api.delete(`/categorias/${c.id}`)
      toast.success("Categoria excluída.")
      lista.recarregar()
    } catch (e) {
      tratarErro(e)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <DialogoFormulario
          titulo="Nova categoria" campos={CAMPOS} inicial={{ nome: "" }}
          aoEnviar={async (d) => { await api.post("/categorias", d); toast.success("Categoria criada."); lista.recarregar() }}
          gatilho={<Button>Nova categoria</Button>}
        />
      </div>
      <EstadoLista carregando={lista.carregando} erro={lista.erro} vazio={lista.dados?.total === 0} mensagemVazia="Nenhuma categoria cadastrada." aoTentarDeNovo={lista.recarregar}>
        {lista.dados && (
          <>
            <Table>
              <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead className="w-48">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {lista.dados.itens.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell className="flex gap-1">
                      <DialogoFormulario
                        titulo="Editar categoria" campos={CAMPOS} inicial={{ nome: c.nome }}
                        aoEnviar={async (d) => { await api.put(`/categorias/${c.id}`, d); toast.success("Categoria atualizada."); lista.recarregar() }}
                        gatilho={<Button size="sm" variant="outline">Editar</Button>}
                      />
                      <ConfirmarAcao titulo={`Excluir ${c.nome}?`} descricao="Só é possível excluir categoria sem produtos." rotulo="Excluir" aoConfirmar={() => excluir(c)} gatilho={<Button size="sm" variant="ghost">Excluir</Button>} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Paginacao pagina={lista.dados.pagina} totalPaginas={lista.dados.total_paginas} total={lista.dados.total} aoMudar={setPagina} />
          </>
        )}
      </EstadoLista>
    </div>
  )
}
