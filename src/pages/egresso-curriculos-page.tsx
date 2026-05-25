import { useState } from "react"
import { NavLink } from "react-router-dom"
import { DownloadSimpleIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteResume, useResumes } from "@/hooks/api/use-resumes"
import { exportResumePdf } from "@/lib/api/resumes"
import type { ResumeListItem } from "@/lib/api/types"
import { downloadBlob } from "@/lib/download"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function EgressoCurriculosPage() {
  const resumesQuery = useResumes()
  const deleteResume = useDeleteResume()
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const resumes = resumesQuery.data?.data ?? []

  const handleDownload = async (resume: ResumeListItem) => {
    setDownloadError(null)
    setDownloadingId(resume.id)
    try {
      const blob = await exportResumePdf(resume.id)
      downloadBlob(blob, `${resume.title}.pdf`)
    } catch {
      setDownloadError("Não foi possível baixar o PDF. Tente novamente.")
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Gestão de Currículos de Egressos do IFAL
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Currículos - Gerencie seus currículos cadastrados.
          </p>
        </div>
        <Button asChild>
          <NavLink to="/home/egresso/curriculo/gerar">Gerar currículo</NavLink>
        </Button>
      </div>

      {downloadError ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {downloadError}
        </p>
      ) : null}

      <Card>
        <CardContent>
          {resumesQuery.isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Carregando currículos…
            </p>
          ) : resumesQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-destructive">
                Não foi possível carregar seus currículos.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => resumesQuery.refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          ) : resumes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Você ainda não tem currículos. Clique em “Gerar currículo” para criar
              o primeiro.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currículo</TableHead>
                  <TableHead>Visibilidade</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{resume.title}</span>
                        {resume.coverLetter ? (
                          <span className="line-clamp-1 text-sm text-muted-foreground">
                            {resume.coverLetter}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{resume.public ? "Público" : "Privado"}</TableCell>
                    <TableCell>{formatDate(resume.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Editar currículo"
                        >
                          <NavLink
                            to={`/home/egresso/curriculo/${resume.id}/editar`}
                            aria-label="Editar currículo"
                          >
                            <PencilSimpleIcon aria-hidden="true" />
                          </NavLink>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(resume)}
                          disabled={downloadingId === resume.id}
                          title="Baixar currículo em PDF"
                          aria-label="Baixar currículo em PDF"
                        >
                          <DownloadSimpleIcon aria-hidden="true" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              title="Excluir currículo"
                              aria-label="Excluir currículo"
                            >
                              <TrashIcon aria-hidden="true" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir currículo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir{" "}
                                <span className="font-medium text-foreground">
                                  {resume.title}
                                </span>
                                ? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteResume.mutate(resume.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
