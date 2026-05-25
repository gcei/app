import { NavLink } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const quickActions = [
  {
    title: "Atualizar perfil",
    description: "Revise seus dados profissionais e mantenha seu cadastro em dia.",
    action: "Editar perfil",
    href: "/home/egresso/configuracoes",
  },
  {
    title: "Revisar currículo",
    description: "Confira as informações que serão usadas na geração do currículo.",
    action: "Abrir currículo",
    href: "/home/egresso/curriculo",
  },
  {
    title: "Explorar vagas",
    description: "Veja oportunidades alinhadas ao seu perfil e aos seus interesses.",
    action: "Ver vagas",
    href: "/home/egresso/vagas",
  },
]

const dashboardCounters = [
  {
    label: "Vagas existentes",
    value: "143",
  },
  {
    label: "Contatos recebidos",
    value: "14",
  },
  {
    label: "Currículos gerados",
    value: "03",
  },
]

export function EgressoInicioPage() {
  return (
    <main className="flex flex-1 flex-col gap-4">
      <section className="grid gap-4 sm:grid-cols-3">
        {dashboardCounters.map((counter) => (
          <Card key={counter.label}>
            <CardContent>
              <CardDescription>{counter.label}</CardDescription>
              <CardTitle className="font-mono text-3xl tracking-tight">
                {counter.value}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid">
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.title} className="border py-0 ring-0 shadow-none">
              <CardHeader className="border-b py-5">
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="py-5">
                <Button asChild variant="outline" className="w-full">
                  <NavLink to={action.href}>{action.action}</NavLink>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
