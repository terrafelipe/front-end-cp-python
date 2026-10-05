import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { toast } from "sonner"
import { useSessao, type Registro } from "@/auth/AuthContext"
import { Campo } from "@/components/Campo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { erroDo, tratarErro, type ErroCampo } from "@/lib/erros"

const CAMPOS: { nome: keyof Registro; rotulo: string; tipo: string }[] = [
  { nome: "empresa", rotulo: "Nome da empresa", tipo: "text" },
  { nome: "cnpj", rotulo: "CNPJ", tipo: "text" },
  { nome: "nome", rotulo: "Seu nome", tipo: "text" },
  { nome: "email", rotulo: "E-mail", tipo: "email" },
  { nome: "senha", rotulo: "Senha", tipo: "password" },
]

export default function Cadastro() {
  const { usuario, registrar } = useSessao()
  const navegar = useNavigate()
  const [dados, setDados] = useState<Registro>({ empresa: "", cnpj: "", nome: "", email: "", senha: "" })
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<ErroCampo | null>(null)

  if (usuario) return <Navigate to="/" replace />

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await registrar(dados)
      toast.success("Empresa cadastrada. Você é o administrador.")
      navegar("/", { replace: true })
    } catch (falha) {
      setErro(tratarErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Cadastrar empresa</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="grid gap-4">
            {CAMPOS.map((c) => (
              <Campo key={c.nome} rotulo={c.rotulo} id={c.nome} erro={erroDo(c.nome, erro)}>
                <Input
                  id={c.nome} type={c.tipo} required value={dados[c.nome]}
                  aria-invalid={!!erroDo(c.nome, erro)}
                  onChange={(e) => setDados({ ...dados, [c.nome]: e.target.value })}
                />
              </Campo>
            ))}
            <Button type="submit" disabled={enviando}>{enviando ? "Cadastrando…" : "Cadastrar"}</Button>
            <p className="text-center text-sm">Já tem conta? <Link to="/login" className="underline">Entrar</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
