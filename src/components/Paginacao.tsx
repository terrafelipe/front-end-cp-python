import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export function Paginacao({ pagina, totalPaginas, total, aoMudar }: { pagina: number; totalPaginas: number; total: number; aoMudar: (p: number) => void }) {
  // Excluiu o último item da última página: volta para a página que ainda existe.
  useEffect(() => {
    if (totalPaginas > 0 && pagina > totalPaginas) aoMudar(totalPaginas)
  }, [pagina, totalPaginas, aoMudar])
  if (totalPaginas <= 1) return <p className="mt-3 text-sm text-muted-foreground">{total} item(ns)</p>
  return (
    <div className="mt-3 flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{total} item(ns) · página {pagina} de {totalPaginas}</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={pagina <= 1} onClick={() => aoMudar(pagina - 1)}>Anterior</Button>
        <Button variant="outline" size="sm" disabled={pagina >= totalPaginas} onClick={() => aoMudar(pagina + 1)}>Próxima</Button>
      </div>
    </div>
  )
}
