export type Papel = "ADMIN" | "OPERADOR"

export interface Usuario {
  id: number
  nome: string
  email: string
  role: Papel
  ativo: boolean
  empresa_id: number
  criado_em: string
}

export interface Token {
  access_token: string
  usuario: Usuario
}

export interface Pagina<T> {
  itens: T[]
  pagina: number
  por_pagina: number
  total: number
  total_paginas: number
}

export interface Produto {
  id: number
  sku: string
  nome: string
  descricao: string | null
  categoria_id: number
  fornecedor_id: number | null
  preco_custo: string
  preco_venda: string
  estoque_minimo: number
  unidade: string
  ativo: boolean
  saldo: number
  em_ruptura: boolean
  criado_em: string
}

export type TipoMovimentacao = "ENTRADA" | "SAIDA" | "AJUSTE"

export interface Movimentacao {
  id: number
  produto_id: number
  tipo: TipoMovimentacao
  quantidade: number
  custo_unitario: string | null
  motivo: string | null
  usuario_id: number
  criado_em: string
}

export interface Categoria {
  id: number
  nome: string
  empresa_id: number
}

export interface Fornecedor {
  id: number
  nome: string
  cnpj: string | null
  email: string | null
  telefone: string | null
  empresa_id: number
}

export interface ResumoDashboard {
  periodo: { de: string; ate: string; dias: number }
  kpis: { valor_estoque: number; produtos_ativos: number; em_ruptura: number; movimentacoes: number }
  serie_diaria: { data: string; entradas: number; saidas: number }[]
  valor_por_categoria: { categoria: string; valor: number }[]
  top_saidas: { produto_id: number; nome: string; quantidade: number }[]
  alertas: Produto[]
}

export interface Relatorio {
  id: number
  origem: "LLM" | "REGRAS"
  modelo: string | null
  criado_em: string
  resultado: {
    resumo: string
    prioridades: { sku: string; nome: string; quantidade_sugerida: number; motivo: string }[]
  }
}
