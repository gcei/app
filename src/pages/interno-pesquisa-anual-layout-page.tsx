import { NavLink, Outlet } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function InternoPesquisaAnualLayoutPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestão de Currículos de Egressos do IFAL
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Pesquisa anual - Configure o formulário aplicado aos egressos.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline">
          <NavLink to="/home/interno/pesquisa-anual/perguntas">Perguntas</NavLink>
        </Button>
        <Button asChild variant="outline">
          <NavLink to="/home/interno/pesquisa-anual/respostas">Respostas</NavLink>
        </Button>
      </div>

      <Outlet />
    </div>
  )
}
