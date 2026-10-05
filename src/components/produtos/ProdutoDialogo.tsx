import { useState, type FormEvent, type ReactElement } from "react"
import { toast } from "sonner"
import { api } from "@/api/cliente"
import type { Categoria, Fornecedor, Produto } from "@/api/tipos"
import { useSessao } from "@/auth/AuthContext"
import { Campo } from "@/components/Campo"
import { Selecao } from "@/components/Selecao"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { erroDo, tratarErro, type ErroCampo } from "@/lib/erros"
import { semVazios } from "@/lib/formato"

interface Props {
  produto?: Produto
  categorias: Categoria[]
  fornecedores: Fornecedor[]
  aoSalvar: () => void
  gatilho: ReactElement
}

function inicial(p?: Produto) {
  return {
    sku: p?.sku ?? "", nome: p?.nome ?? "", descricao: p?.descricao ?? "",
    categoria_id: p ? String(p.categoria_id) : "", fornecedor_id: p?.fornecedor_id ? String(p.fornecedor_id) : "",
    estoque_minimo: String(p?.estoque_minimo ?? 0), unidade: p?.unidade ?? "UN", preco_venda: p?.preco_venda ?? "",
  }
}

export function ProdutoDialogo({ produto, categorias, fornecedores, aoSalvar, gatilho }: Props) {
  const { ehAdmin } = useSessao()
  const [aberto, setAberto] = useState(false)
  const [form, setForm] = useState(() => inicial(produto))
  const [erro, setErro] = useState<ErroCampo | null>(null)
  const [enviando, setEnviando] = useState(false)
  const alterar = (campo: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [campo]: e.target.value })

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const corpo: Record<string, unknown> = {
      sku: form.sku, nome: form.nome, descricao: form.descricao || null,
      categoria_id: Number(form.categoria_id), fornecedor_id: form.fornecedor_id ? Number(form.fornecedor_id) : null,
      estoque_minimo: Number(form.estoque_minimo), unidade: form.unidade,
    }
    // Operador não envia preço de venda: o back recusaria (RN-09).
    if (ehAdmin && form.preco_venda !== "") corpo.preco_venda = Number(form.preco_venda)
    try {
      // Na edição, descrição vazia vai como "" para limpar o valor salvo.
      if (produto) await api.put(`/produtos/${produto.id}`, { ...semVazios(corpo), descricao: form.descricao })
      else await api.post("/produtos", semVazios(corpo))
      toast.success(produto ? "Produto atualizado." : "Produto criado.")
      setAberto(false)
      aoSalvar()
    } catch (falha) {
      setErro(tratarErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  function aoMudarAberto(a: boolean) {
    setAberto(a)
    if (a) {
      setForm(inicial(produto))
      setErro(null)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoMudarAberto}>
      <DialogTrigger render={gatilho} />
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>{produto ? "Editar produto" : "Novo produto"}</DialogTitle></DialogHeader>
        <form onSubmit={enviar} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo rotulo="SKU" id="sku" erro={erroDo("sku", erro)}>
              <Input id="sku" required value={form.sku} onChange={alterar("sku")} aria-invalid={!!erroDo("sku", erro)} />
            </Campo>
            <Campo rotulo="Unidade" id="unidade" erro={erroDo("unidade", erro)}>
              <Input id="unidade" value={form.unidade} onChange={alterar("unidade")} />
            </Campo>
          </div>
          <Campo rotulo="Nome" id="nome" erro={erroDo("nome", erro)}>
            <Input id="nome" required value={form.nome} onChange={alterar("nome")} aria-invalid={!!erroDo("nome", erro)} />
          </Campo>
          <Campo rotulo="Categoria" id="categoria_id" erro={erroDo("categoria_id", erro)}>
            <Selecao id="categoria_id" required value={form.categoria_id} onChange={alterar("categoria_id")} aria-invalid={!!erroDo("categoria_id", erro)}>
              <option value="">Selecione…</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Selecao>
          </Campo>
          <Campo rotulo="Fornecedor" id="fornecedor_id" erro={erroDo("fornecedor_id", erro)} dica={produto?.fornecedor_id ? "A API não desvincula fornecedor; dá para trocar por outro." : undefined}>
            <Selecao id="fornecedor_id" value={form.fornecedor_id} onChange={alterar("fornecedor_id")}>
              <option value="" disabled={!!produto?.fornecedor_id}>Nenhum</option>
              {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </Selecao>
          </Campo>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo rotulo="Estoque mínimo" id="estoque_minimo" erro={erroDo("estoque_minimo", erro)}>
              <Input id="estoque_minimo" type="number" min={0} value={form.estoque_minimo} onChange={alterar("estoque_minimo")} aria-invalid={!!erroDo("estoque_minimo", erro)} />
            </Campo>
            <Campo rotulo="Preço de venda (R$)" id="preco_venda" erro={erroDo("preco_venda", erro)} dica={ehAdmin ? undefined : "Só o administrador altera o preço."}>
              <Input id="preco_venda" type="number" step="0.01" min={0} disabled={!ehAdmin} value={form.preco_venda} onChange={alterar("preco_venda")} />
            </Campo>
          </div>
          <Campo rotulo="Descrição" id="descricao" erro={erroDo("descricao", erro)}>
            <Input id="descricao" value={form.descricao} onChange={alterar("descricao")} />
          </Campo>
          <DialogFooter><Button type="submit" disabled={enviando}>{enviando ? "Salvando…" : "Salvar"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
