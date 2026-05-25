import type { CurriculoMock } from "@/mocks/egresso-curriculos"
import { curriculosMockados } from "@/mocks/egresso-curriculos"

export function saveCurriculum(curriculumData: Omit<CurriculoMock, 'id' | 'ultimaAtualizacao' | 'status' | 'resumo' | 'vagasUtilizadas'>): CurriculoMock {
  const now = new Date()
  const newCurriculum: CurriculoMock = {
    ...curriculumData,
    id: `curriculo-${Date.now()}`,
    ultimaAtualizacao: now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', ''),
    status: "Ativo",
    resumo: `Versão de currículo criada em ${now.toLocaleDateString('pt-BR')}.`,
    vagasUtilizadas: []
  }
  
  curriculosMockados.push(newCurriculum)
  return newCurriculum
}

export function updateCurriculum(id: string, curriculumData: Omit<CurriculoMock, 'id' | 'ultimaAtualizacao' | 'status' | 'resumo' | 'vagasUtilizadas'>): CurriculoMock | null {
  const index = curriculosMockados.findIndex(c => c.id === id)
  if (index === -1) return null
  
  const now = new Date()
  const updatedCurriculum: CurriculoMock = {
    ...curriculumData,
    id,
    ultimaAtualizacao: now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', ''),
    status: curriculosMockados[index].status,
    resumo: curriculosMockados[index].resumo,
    vagasUtilizadas: curriculosMockados[index].vagasUtilizadas
  }
  
  curriculosMockados[index] = updatedCurriculum
  return updatedCurriculum
}

export function deleteCurriculum(id: string): boolean {
  const index = curriculosMockados.findIndex(c => c.id === id)
  if (index === -1) return false

  curriculosMockados.splice(index, 1)
  return true
}
