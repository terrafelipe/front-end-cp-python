import type { SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

/** Select nativo com o visual do Input: simples, acessível e fácil de testar. */
export function Selecao({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}
