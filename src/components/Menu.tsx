import { NavLink } from "react-router"
import { cn } from "@/lib/utils"

const LINKS = [
  { para: "/", rotulo: "Dashboard", admin: false },
  { para: "/produtos", rotulo: "Produtos", admin: false },
  { para: "/movimentacoes", rotulo: "Movimentações", admin: false },
  { para: "/categorias", rotulo: "Categorias", admin: false },
  { para: "/fornecedores", rotulo: "Fornecedores", admin: true },
  { para: "/usuarios", rotulo: "Usuários", admin: true },
]

/** Menu conforme o papel. Só conveniência: o back revalida tudo (RN-09). */
export function Menu({ ehAdmin, aoNavegar }: { ehAdmin: boolean; aoNavegar?: () => void }) {
  return (
    <nav className="grid gap-1" aria-label="Menu principal">
      {LINKS.filter((l) => ehAdmin || !l.admin).map((l) => (
        <NavLink
          key={l.para}
          to={l.para}
          end={l.para === "/"}
          onClick={aoNavegar}
          className={({ isActive }) =>
            cn("rounded-md px-3 py-2 text-sm hover:bg-accent", isActive && "bg-accent font-medium")
          }
        >
          {l.rotulo}
        </NavLink>
      ))}
    </nav>
  )
}
