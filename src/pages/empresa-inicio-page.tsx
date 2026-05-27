import { Line, LineChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { evolucaoEgressos } from "@/mocks/interno-dashboard"

// TODO(API): trocar os mocks pela contagem/evolução real (`GET /users` com
// role STUDENT). Cards de Empresas e Vagas foram removidos por ora.
const egressosChartConfig = {
  total: {
    label: "Egressos",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const numberFormatter = new Intl.NumberFormat("pt-BR")

export function EmpresaInicioPage() {
  const totalEgressos = evolucaoEgressos[evolucaoEgressos.length - 1]?.total ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestão de Currículos de Egressos do IFAL
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Início - Acompanhe os indicadores de egressos da plataforma.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Egressos</CardTitle>
            <CardDescription>
              Total de egressos cadastrados na plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-4xl font-semibold tracking-tight text-foreground">
              {numberFormatter.format(totalEgressos)}
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Evolução de egressos</CardTitle>
            <CardDescription>
              Crescimento de cadastros de egressos ao longo do tempo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={egressosChartConfig} className="min-h-72 w-full">
              <LineChart data={evolucaoEgressos} margin={{ left: 8, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="mes"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-total)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
