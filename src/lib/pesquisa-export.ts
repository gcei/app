import * as XLSX from "xlsx"

import type { PesquisaForm, PesquisaResposta } from "@/lib/pesquisa-form-storage"

export type ExportFilters = {
  dataInicio?: string
  dataFim?: string
}

function formatarData(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

function nomeArquivo(form: PesquisaForm, filters?: ExportFilters): string {
  const slug = form.titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
  const intervalo =
    filters?.dataInicio || filters?.dataFim
      ? `_${filters?.dataInicio ?? "inicio"}_a_${filters?.dataFim ?? "fim"}`
      : ""
  const stamp = new Date().toISOString().slice(0, 10)
  return `${slug || "pesquisa"}-respostas${intervalo}-${stamp}.xlsx`
}

export function filtrarRespostasPorPeriodo(
  respostas: PesquisaResposta[],
  filters?: ExportFilters
): PesquisaResposta[] {
  if (!filters?.dataInicio && !filters?.dataFim) return respostas

  const inicioMs = filters?.dataInicio
    ? new Date(`${filters.dataInicio}T00:00:00`).getTime()
    : -Infinity
  const fimMs = filters?.dataFim
    ? new Date(`${filters.dataFim}T23:59:59.999`).getTime()
    : Infinity

  return respostas.filter((r) => {
    const t = new Date(r.submetidoEm).getTime()
    if (Number.isNaN(t)) return false
    return t >= inicioMs && t <= fimMs
  })
}

export function exportRespostasParaExcel(
  form: PesquisaForm,
  respostas: PesquisaResposta[],
  filters?: ExportFilters
): number {
  const filtradas = filtrarRespostasPorPeriodo(respostas, filters)

  const cabecalho = [
    "Egresso",
    "CPF",
    "Data da resposta",
    ...form.perguntas.map((p) => p.enunciado),
  ]

  const linhas = filtradas.map((r) => [
    r.egressoNome,
    r.egressoCpf,
    formatarData(r.submetidoEm),
    ...form.perguntas.map((p) => r.respostas[p.id] ?? ""),
  ])

  const aoa = [cabecalho, ...linhas]
  const worksheet = XLSX.utils.aoa_to_sheet(aoa)

  worksheet["!cols"] = cabecalho.map((header) => ({
    wch: Math.max(header.length + 2, 18),
  }))

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Respostas")

  XLSX.writeFile(workbook, nomeArquivo(form, filters))

  return filtradas.length
}
