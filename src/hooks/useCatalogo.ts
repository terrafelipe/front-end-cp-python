import { useEffect } from "react"
import { toast } from "sonner"
import { api } from "@/api/cliente"
import type { Categoria, Fornecedor, Pagina } from "@/api/tipos"
import { useConsulta } from "./useConsulta"

/** Categorias e fornecedores para selects (até 100, o máximo da API). */
export function useCatalogo() {
  const categorias = useConsulta(() => api.get<Pagina<Categoria>>("/categorias", { por_pagina: 100 }), [])
  const fornecedores = useConsulta(
    () => api.get<Pagina<Fornecedor>>("/fornecedores", { por_pagina: 100 }).catch(() => null),
    [],
  )
  useEffect(() => {
    if (categorias.erro) toast.error(`Categorias não carregaram: ${categorias.erro.message}`)
  }, [categorias.erro])
  return { categorias: categorias.dados?.itens ?? [], fornecedores: fornecedores.dados?.itens ?? [] }
}
