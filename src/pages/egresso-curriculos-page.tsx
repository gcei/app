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
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { downloadCurriculo } from "@/lib/curriculo-download"
import { deleteCurriculum } from "@/lib/curriculo-storage"
import { curriculosMockados } from "@/mocks/egresso-curriculos"

export function EgressoCurriculosPage() {
  const [curriculos, setCurriculos] = useState(() => [...curriculosMockados])

  const handleDelete = (id: string) => {
    if (deleteCurriculum(id)) {
      setCurriculos([...curriculosMockados])
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

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curriculos.map((curriculo) => (
                <TableRow key={curriculo.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{curriculo.nome}</span>
                      <span className="text-sm text-muted-foreground">
                        {curriculo.resumo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{curriculo.status}</TableCell>
                  <TableCell>{curriculo.ultimaAtualizacao}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="Editar currículo"
                      >
                        <NavLink
                          to={`/home/egresso/curriculo/${curriculo.id}/editar`}
                          aria-label="Editar currículo"
                        >
                          <PencilSimpleIcon aria-hidden="true" />
                        </NavLink>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadCurriculo(curriculo)}
                        title="Baixar currículo"
                        aria-label="Baixar currículo"
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
                                {curriculo.nome}
                              </span>
                              ? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(curriculo.id)}
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
        </CardContent>
      </Card>
    </div>
  )
}
