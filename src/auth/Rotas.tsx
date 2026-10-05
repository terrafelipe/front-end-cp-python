import { Navigate, Outlet, useLocation } from "react-router"
import { useSessao } from "./AuthContext"

export function RotaProtegida() {
  const { usuario, carregando } = useSessao()
  const local = useLocation()
  if (carregando) return <p className="p-8 text-muted-foreground">Carregando…</p>
  if (!usuario) return <Navigate to="/login" replace state={{ de: local.pathname }} />
  return <Outlet />
}

/** Atalho de interface: o back recusa de qualquer forma (RN-09). */
export function SoAdmin() {
  const { ehAdmin } = useSessao()
  return ehAdmin ? <Outlet /> : <Navigate to="/" replace />
}
