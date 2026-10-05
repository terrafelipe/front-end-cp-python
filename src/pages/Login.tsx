import { useState, type FormEvent } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router"
import { useSessao } from "@/auth/AuthContext"
import { Campo } from "@/components/Campo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { erroDo, tratarErro, type ErroCampo } from "@/lib/erros"

export default function Login() {
  const { usuario, entrar } = useSessao()
  const navegar = useNavigate()
  const destino = (useLocation().state as { de?: string } | null)?.de ?? "/"
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<ErroCampo | null>(null)

  if (usuario) return <Navigate to={destino} replace />

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await entrar(email, senha)
      navegar(destino, { replace: true })
    } catch (falha) {
      setErro(tratarErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>Entrar no Gestor de Estoque</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="grid gap-4">
            <Campo rotulo="E-mail" id="email" erro={erroDo("email", erro)}>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Campo>
            <Campo rotulo="Senha" id="senha" erro={erroDo("senha", erro)}>
              <Input id="senha" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
            </Campo>
            {erro && !erro.campo && <p role="alert" className="text-sm text-destructive">{erro.mensagem}</p>}
            <Button type="submit" disabled={enviando}>{enviando ? "Entrando…" : "Entrar"}</Button>
            <p className="text-center text-sm">Nova empresa? <Link to="/cadastro" className="underline">Cadastre-se</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
