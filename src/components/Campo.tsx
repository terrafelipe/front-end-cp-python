import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

export function Campo({ rotulo, id, erro, dica, children }: { rotulo: string; id: string; erro?: string; dica?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{rotulo}</Label>
      {children}
      {erro && <p role="alert" className="text-sm text-destructive">{erro}</p>}
      {!erro && dica && <p className="text-xs text-muted-foreground">{dica}</p>}
    </div>
  )
}
