import { Navigate, Route, Routes } from "react-router-dom"

import { ProtectedRoute } from "@/components/protected-route"
import { RequireSurvey } from "@/components/require-survey"
import { HomeRedirect, RequireRole } from "@/components/require-role"
import { EmpresaCandidatosPage } from "@/pages/empresa-candidatos-page"
import { EmpresaCandidatoCurriculoPage } from "@/pages/empresa-candidato-curriculo-page"
import { EgressoHomePage } from "@/pages/egresso-home-page"
import { EgressoCurriculosPage } from "@/pages/egresso-curriculos-page"
import { EgressoCurriculoGerarPage } from "@/pages/egresso-curriculo-gerar-page"
import { EgressoConfiguracoesPage } from "@/pages/egresso-configuracoes-page"
import { EmpresaHomePage } from "@/pages/empresa-home-page"
// Módulo "Início" desativado temporariamente.
// import { EmpresaInicioPage } from "@/pages/empresa-inicio-page"
import { EmpresaEgressosCadastradosPage } from "@/pages/empresa-egressos-cadastrados-page"
import { EmpresaEgressoEditarPage } from "@/pages/empresa-egresso-editar-page"
import { EmpresaConfiguracoesPage } from "@/pages/empresa-configuracoes-page"
import { EmpresaUsuariosPage } from "@/pages/empresa-usuarios-page"
import { EmpresaUsuarioNovoPage } from "@/pages/empresa-usuario-novo-page"
import { EmpresaPesquisaAnualPage } from "@/pages/empresa-pesquisa-anual-page"
import { EmpresaPesquisaAnualEditarPage } from "@/pages/empresa-pesquisa-anual-editar-page"
import { EmpresaPesquisaAnualRespostasPage } from "@/pages/empresa-pesquisa-anual-respostas-page"
import { CadastroPage } from "@/pages/cadastro-page"
import { LoginPage } from "@/pages/login-page"
import { PesquisaAnualPage } from "@/pages/pesquisa-anual-page"
import { SobrePage } from "@/pages/sobre-page"

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/pesquisa/:slug" element={<PesquisaAnualPage />} />
        <Route element={<RequireSurvey />}>
          <Route path="/" element={<HomeRedirect />} />

          <Route element={<RequireRole role="STUDENT" />}>
            <Route path="/home/egresso" element={<EgressoHomePage />}>
              <Route index element={<Navigate replace to="curriculo" />} />
              <Route path="curriculo" element={<EgressoCurriculosPage />} />
              <Route path="curriculo/gerar" element={<EgressoCurriculoGerarPage />} />
              <Route
                path="curriculo/:curriculoId/editar"
                element={<EgressoCurriculoGerarPage />}
              />
              <Route path="sobre" element={<SobrePage />} />
              <Route path="configuracoes" element={<EgressoConfiguracoesPage />} />
            </Route>
          </Route>

          <Route element={<RequireRole role="ADMIN" />}>
            <Route path="/home/interno" element={<EmpresaHomePage />}>
              {/* Módulo "Início" desativado temporariamente:
              <Route index element={<Navigate replace to="/home/interno/inicio" />} />
              <Route path="inicio" element={<EmpresaInicioPage />} /> */}
              <Route index element={<Navigate replace to="/home/interno/candidatos" />} />
              <Route path="candidatos" element={<EmpresaCandidatosPage />} />
              <Route
                path="candidatos/:candidatoId"
                element={<EmpresaCandidatoCurriculoPage />}
              />
              <Route
                path="egressos-cadastrados"
                element={<EmpresaEgressosCadastradosPage />}
              />
              <Route
                path="egressos-cadastrados/:egressoId/editar"
                element={<EmpresaEgressoEditarPage />}
              />
              <Route path="pesquisa-anual" element={<EmpresaPesquisaAnualPage />} />
              <Route
                path="pesquisa-anual/novo"
                element={<EmpresaPesquisaAnualEditarPage />}
              />
              <Route
                path="pesquisa-anual/:formId/editar"
                element={<EmpresaPesquisaAnualEditarPage />}
              />
              <Route
                path="pesquisa-anual/:formId/respostas"
                element={<EmpresaPesquisaAnualRespostasPage />}
              />
              <Route path="usuarios" element={<EmpresaUsuariosPage />} />
              <Route path="usuarios/novo" element={<EmpresaUsuarioNovoPage />} />
              <Route path="configuracoes" element={<EmpresaConfiguracoesPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
