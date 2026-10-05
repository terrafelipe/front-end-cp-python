import { useState, type ReactElement } from "react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

/** `gatilho` é o elemento que abre a confirmação (padrão `render` do Base UI). */
export function ConfirmarAcao({ titulo, descricao, rotulo, aoConfirmar, gatilho }: {
  titulo: string; descricao: string; rotulo: string; aoConfirmar: () => void; gatilho: ReactElement
}) {
  const [aberto, setAberto] = useState(false)
  return (
    <AlertDialog open={aberto} onOpenChange={setAberto}>
      <AlertDialogTrigger render={gatilho} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{descricao}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => { setAberto(false); aoConfirmar() }}>{rotulo}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
