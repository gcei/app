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
import {
  evolucaoEgressos,
  evolucaoEmpresas,
  evolucaoVagas,
} from "@/mocks/interno-dashboard"

const egressosChartConfig = {
  total: {
    label: "Egressos",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const empresasChartConfig = {
  total: {
    label: "Empresas",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const vagasChartConfig = {
  andamento: {
    label: "Andamento",
    color: "var(--chart-1)",
  },
  pausadas: {
    label: "Pausadas",
    color: "oklch(0.623 0.214 259.815)",
  },
} satisfies ChartConfig

const numberFormatter = new Intl.NumberFormat("pt-BR")

export function InternoInicioPage() {
  const totalEgressos = evolucaoEgressos[evolucaoEgressos.length - 1]?.total ?? 0
  const totalEmpresas = evolucaoEmpresas[evolucaoEmpresas.length - 1]?.total ?? 0
  const totalVagas =
    (evolucaoVagas[evolucaoVagas.length - 1]?.andamento ?? 0) +
    (evolucaoVagas[evolucaoVagas.length - 1]?.pausadas ?? 0)

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Egressos</CardTitle>
            <CardDescription>Total de egressos cadastrados na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-4xl font-semibold tracking-tight text-foreground">
              {numberFormatter.format(totalEgressos)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empresas</CardTitle>
            <CardDescription>Total de empresas cadastradas na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-4xl font-semibold tracking-tight text-foreground">
              {numberFormatter.format(totalEmpresas)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vagas</CardTitle>
            <CardDescription>Total de vagas cadastradas na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-4xl font-semibold tracking-tight text-foreground">
              {numberFormatter.format(totalVagas)}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de egressos</CardTitle>
            <CardDescription>Crescimento de cadastros de egressos ao longo do tempo.</CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>Evolução de empresas</CardTitle>
            <CardDescription>Crescimento de cadastros de empresas ao longo do tempo.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={empresasChartConfig} className="min-h-72 w-full">
              <LineChart data={evolucaoEmpresas} margin={{ left: 8, right: 8, top: 8 }}>
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

        <Card>
          <CardHeader>
            <CardTitle>Evolução de vagas</CardTitle>
            <CardDescription>
              Acompanhe as vagas em andamento e as vagas pausadas ao longo do tempo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={vagasChartConfig} className="min-h-72 w-full">
              <LineChart data={evolucaoVagas} margin={{ left: 8, right: 8, top: 8 }}>
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
                  dataKey="andamento"
                  stroke="var(--color-andamento)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pausadas"
                  stroke="var(--color-pausadas)"
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
