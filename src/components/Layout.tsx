import { MenuIcon } from "lucide-react"
import { useState } from "react"
import { Outlet } from "react-router"
import { useSessao } from "@/auth/AuthContext"
import { Menu } from "@/components/Menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Layout() {
  const { usuario, ehAdmin, sair } = useSessao()
  const [gaveta, setGaveta] = useState(false)
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[220px_1fr]">
      <aside className="hidden border-r p-4 md:block">
        <p className="mb-4 px-3 font-semibold">Gestor de Estoque</p>
        <Menu ehAdmin={ehAdmin} />
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <Sheet open={gaveta} onOpenChange={setGaveta}>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menu">
                  <MenuIcon />
                </Button>
              }
            />
            <SheetContent side="left" className="p-4">
              <SheetTitle>Gestor de Estoque</SheetTitle>
              <Menu ehAdmin={ehAdmin} aoNavegar={() => setGaveta(false)} />
            </SheetContent>
          </Sheet>
          <span className="ml-auto text-sm text-muted-foreground">
            {usuario?.nome} · {usuario?.role}
          </span>
          <Button variant="ghost" size="sm" onClick={sair}>Sair</Button>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
