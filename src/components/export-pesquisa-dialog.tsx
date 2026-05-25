import { useMemo, useState } from "react"
import { DownloadSimpleIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  type PesquisaForm,
  getRespostas,
} from "@/lib/pesquisa-form-storage"
import {
  exportRespostasParaExcel,
  filtrarRespostasPorPeriodo,
} from "@/lib/pesquisa-export"

type Props = {
  form: PesquisaForm
  trigger?: React.ReactNode
  triggerLabel?: string
  triggerSize?: "default" | "sm"
  disabled?: boolean
}

export function ExportPesquisaDialog({
  form,
  trigger,
  triggerLabel = "Exportar resultados",
  triggerSize = "default",
  disabled,
}: Props) {
  const [open, setOpen] = useState(false)
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  const respostas = useMemo(() => (open ? getRespostas(form.id) : []), [open, form.id])

  const totalNoPeriodo = useMemo(() => {
    if (!open) return 0
    return filtrarRespostasPorPeriodo(respostas, {
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
    }).length
  }, [open, respostas, dataInicio, dataFim])

  const periodoInvalido = Boolean(
    dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)
  )

  const handleExport = () => {
    const exportados = exportRespostasParaExcel(form, respostas, {
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
    })
    if (exportados > 0) {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size={triggerSize} disabled={disabled}>
            <DownloadSimpleIcon aria-hidden="true" />
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar resultados</DialogTitle>
          <DialogDescription>
            Selecione opcionalmente um período. Deixe em branco para exportar todas as respostas
            do formulário "{form.titulo}".
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="export-data-inicio" className="text-sm font-medium">
                Data início
              </label>
              <Input
                id="export-data-inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                max={dataFim || undefined}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="export-data-fim" className="text-sm font-medium">
                Data fim
              </label>
              <Input
                id="export-data-fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                min={dataInicio || undefined}
              />
            </div>
          </div>

          {periodoInvalido ? (
            <p className="text-sm text-destructive">
              A data de início não pode ser posterior à data de fim.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {totalNoPeriodo} resposta(s) serão exportadas
              {dataInicio || dataFim ? " no período selecionado." : "."}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={periodoInvalido || totalNoPeriodo === 0}
          >
            <DownloadSimpleIcon aria-hidden="true" />
            Exportar ({totalNoPeriodo})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
