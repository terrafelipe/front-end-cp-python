import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/api/cliente"
import type { Fornecedor, Pagina } from "@/api/tipos"
import { ConfirmarAcao } from "@/components/ConfirmarAcao"
import { DialogoFormulario, type DefCampo } from "@/components/DialogoFormulario"
import { EstadoLista } from "@/components/EstadoLista"
import { Paginacao } from "@/components/Paginacao"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useConsulta } from "@/hooks/useConsulta"
import { tratarErro } from "@/lib/erros"
import { semVazios } from "@/lib/formato"

type Form = { nome: string; cnpj: string; email: string; telefone: string }
const CAMPOS: DefCampo<Form>[] = [
  { nome: "nome", rotulo: "Nome", obrigatorio: true },
  { nome: "cnpj", rotulo: "CNPJ" },
  { nome: "email", rotulo: "E-mail", tipo: "email" },
  { nome: "telefone", rotulo: "Telefone" },
]
// Na criação, campo vazio fica de fora; na edição vai "" e o back limpa o valor.
const corpo = (d: Form) => semVazios(d)

export default function Fornecedores() {
  const [pagina, setPagina] = useState(1)
  const lista = useConsulta(() => api.get<Pagina<Fornecedor>>("/fornecedores", { pagina, por_pagina: 20 }), [pagina])

  async function excluir(f: Fornecedor) {
    try {
      await api.delete(`/fornecedores/${f.id}`)
      toast.success("Fornecedor excluído.")
      lista.recarregar()
    } catch (e) {
      tratarErro(e)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Fornecedores</h1>
        <DialogoFormulario
          titulo="Novo fornecedor" campos={CAMPOS} inicial={{ nome: "", cnpj: "", email: "", telefone: "" }}
          aoEnviar={async (d) => { await api.post("/fornecedores", corpo(d)); toast.success("Fornecedor criado."); lista.recarregar() }}
          gatilho={<Button>Novo fornecedor</Button>}
        />
      </div>
      <EstadoLista carregando={lista.carregando} erro={lista.erro} vazio={lista.dados?.total === 0} mensagemVazia="Nenhum fornecedor cadastrado." aoTentarDeNovo={lista.recarregar}>
        {lista.dados && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>CNPJ</TableHead><TableHead>E-mail</TableHead><TableHead>Telefone</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                <TableBody>
                  {lista.dados.itens.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.nome}</TableCell>
                      <TableCell>{f.cnpj ?? "—"}</TableCell>
                      <TableCell>{f.email ?? "—"}</TableCell>
                      <TableCell>{f.telefone ?? "—"}</TableCell>
                      <TableCell className="flex gap-1">
                        <DialogoFormulario
                          titulo="Editar fornecedor" campos={CAMPOS}
                          inicial={{ nome: f.nome, cnpj: f.cnpj ?? "", email: f.email ?? "", telefone: f.telefone ?? "" }}
                          aoEnviar={async (d) => { await api.put(`/fornecedores/${f.id}`, d); toast.success("Fornecedor atualizado."); lista.recarregar() }}
                          gatilho={<Button size="sm" variant="outline">Editar</Button>}
                        />
                        <ConfirmarAcao titulo={`Excluir ${f.nome}?`} descricao="Só é possível excluir fornecedor sem produtos." rotulo="Excluir" aoConfirmar={() => excluir(f)} gatilho={<Button size="sm" variant="ghost">Excluir</Button>} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Paginacao pagina={lista.dados.pagina} totalPaginas={lista.dados.total_paginas} total={lista.dados.total} aoMudar={setPagina} />
          </>
        )}
      </EstadoLista>
    </div>
  )
}
