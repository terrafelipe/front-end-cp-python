import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/api/cliente"
import type { Pagina, Usuario } from "@/api/tipos"
import { useSessao } from "@/auth/AuthContext"
import { ConfirmarAcao } from "@/components/ConfirmarAcao"
import { DialogoFormulario, type DefCampo } from "@/components/DialogoFormulario"
import { EstadoLista } from "@/components/EstadoLista"
import { Paginacao } from "@/components/Paginacao"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useConsulta } from "@/hooks/useConsulta"
import { tratarErro } from "@/lib/erros"

type Form = { nome: string; email: string; senha: string; role: string }
const PAPEIS = [{ valor: "OPERADOR", rotulo: "Operador" }, { valor: "ADMIN", rotulo: "Administrador" }]
const NOVO: DefCampo<Form>[] = [
  { nome: "nome", rotulo: "Nome", obrigatorio: true },
  { nome: "email", rotulo: "E-mail", tipo: "email", obrigatorio: true },
  { nome: "senha", rotulo: "Senha", tipo: "password", obrigatorio: true },
  { nome: "role", rotulo: "Papel", tipo: "select", opcoes: PAPEIS },
]
const EDICAO: DefCampo<Form>[] = NOVO.map((c) => (c.nome === "senha" ? { ...c, rotulo: "Nova senha (opcional)", obrigatorio: false } : c))

export default function Usuarios() {
  const { usuario: eu, atualizar } = useSessao()
  const [pagina, setPagina] = useState(1)
  const lista = useConsulta(() => api.get<Pagina<Usuario>>("/usuarios", { pagina, por_pagina: 20, incluir_inativos: true }), [pagina])

  async function desativar(u: Usuario) {
    try {
      await api.delete(`/usuarios/${u.id}`)
      toast.success(`${u.nome} desativado.`)
      lista.recarregar()
    } catch (e) {
      tratarErro(e)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <DialogoFormulario
          titulo="Novo usuário" campos={NOVO} inicial={{ nome: "", email: "", senha: "", role: "OPERADOR" }}
          aoEnviar={async (d) => { await api.post("/usuarios", d); toast.success("Usuário criado."); lista.recarregar() }}
          gatilho={<Button>Novo usuário</Button>}
        />
      </div>
      <EstadoLista carregando={lista.carregando} erro={lista.erro} vazio={lista.dados?.total === 0} mensagemVazia="Nenhum usuário." aoTentarDeNovo={lista.recarregar}>
        {lista.dados && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>E-mail</TableHead><TableHead>Papel</TableHead><TableHead>Situação</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                <TableBody>
                  {lista.dados.itens.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.nome}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role === "ADMIN" ? "Administrador" : "Operador"}</TableCell>
                      <TableCell>{u.ativo ? <Badge variant="secondary">ativo</Badge> : <Badge variant="outline">inativo</Badge>}</TableCell>
                      <TableCell className="flex gap-1">
                        <DialogoFormulario
                          titulo="Editar usuário" campos={EDICAO} inicial={{ nome: u.nome, email: u.email, senha: "", role: u.role }}
                          aoEnviar={async (d) => {
                            const { senha, ...resto } = d
                            await api.put(`/usuarios/${u.id}`, senha ? d : resto)
                            toast.success("Usuário atualizado.")
                            lista.recarregar()
                            // Quem muda o próprio papel vê o menu certo sem recarregar a página.
                            // Fora do await: o PUT já deu certo, uma falha aqui não desfaz o formulário.
                            if (u.id === eu?.id) atualizar().catch(tratarErro)
                          }}
                          gatilho={<Button size="sm" variant="outline">Editar</Button>}
                        />
                        {u.ativo && u.id !== eu?.id && (
                          <ConfirmarAcao titulo={`Desativar ${u.nome}?`} descricao="A pessoa perde o acesso na hora; o histórico é mantido." rotulo="Desativar" aoConfirmar={() => desativar(u)} gatilho={<Button size="sm" variant="ghost">Desativar</Button>} />
                        )}
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
