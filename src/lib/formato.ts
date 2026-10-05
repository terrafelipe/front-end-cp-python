const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const DATA_HORA = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" })

export function dinheiro(valor: string | number): string {
  return BRL.format(Number(valor)).replace(/ /g, " ")
}

export function dataHora(iso: string): string {
  return DATA_HORA.format(new Date(iso)).replace(",", "")
}

/** "2026-09-25" → "25/09" sem passar por Date (que deslocaria o dia pelo fuso). */
export function dataCurta(isoData: string): string {
  const [, mes, dia] = isoData.slice(0, 10).split("-")
  return `${dia}/${mes}`
}

export const ROTULO_TIPO = { ENTRADA: "Entrada", SAIDA: "Saída", AJUSTE: "Ajuste" } as const
