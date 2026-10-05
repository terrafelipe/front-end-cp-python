import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { AuthProvider } from "@/auth/AuthContext"
import { RotaProtegida, SoAdmin } from "@/auth/Rotas"
import Layout from "@/components/Layout"
import { Toaster } from "@/components/ui/sonner"
import Cadastro from "@/pages/Cadastro"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import ProdutoHistorico from "@/pages/ProdutoHistorico"
import Produtos from "@/pages/Produtos"

function EmBreve({ titulo }: { titulo: string }) {
  return <h1 className="text-2xl font-semibold">{titulo}</h1>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route element={<RotaProtegida />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="produtos" element={<Produtos />} />
              <Route path="produtos/:id" element={<ProdutoHistorico />} />
              <Route path="movimentacoes" element={<EmBreve titulo="Movimentações" />} />
              <Route path="categorias" element={<EmBreve titulo="Categorias" />} />
              <Route element={<SoAdmin />}>
                <Route path="fornecedores" element={<EmBreve titulo="Fornecedores" />} />
                <Route path="usuarios" element={<EmBreve titulo="Usuários" />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}
