import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { AuthProvider } from "@/auth/AuthContext"
import { RotaProtegida, SoAdmin } from "@/auth/Rotas"
import Layout from "@/components/Layout"
import { Toaster } from "@/components/ui/sonner"
import Cadastro from "@/pages/Cadastro"
import Categorias from "@/pages/Categorias"
import Dashboard from "@/pages/Dashboard"
import Fornecedores from "@/pages/Fornecedores"
import Login from "@/pages/Login"
import Movimentacoes from "@/pages/Movimentacoes"
import ProdutoHistorico from "@/pages/ProdutoHistorico"
import Produtos from "@/pages/Produtos"
import Usuarios from "@/pages/Usuarios"

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
              <Route path="movimentacoes" element={<Movimentacoes />} />
              <Route path="categorias" element={<Categorias />} />
              <Route element={<SoAdmin />}>
                <Route path="fornecedores" element={<Fornecedores />} />
                <Route path="usuarios" element={<Usuarios />} />
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
