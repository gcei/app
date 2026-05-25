import { Navigate, Route, Routes } from "react-router-dom"

import { ProtectedRoute } from "@/components/protected-route"
import { EmpresaCandidatosPage } from "@/pages/empresa-candidatos-page"
import { EmpresaCandidatoCurriculoPage } from "@/pages/empresa-candidato-curriculo-page"
import { EgressoHomePage } from "@/pages/egresso-home-page"
import { EgressoCurriculosPage } from "@/pages/egresso-curriculos-page"
import { EgressoCurriculoGerarPage } from "@/pages/egresso-curriculo-gerar-page"
import { EgressoConfiguracoesPage } from "@/pages/egresso-configuracoes-page"
import { EmpresaHomePage } from "@/pages/empresa-home-page"
import { EmpresaConfiguracoesPage } from "@/pages/empresa-configuracoes-page"
import { EmpresaPesquisaAnualPage } from "@/pages/empresa-pesquisa-anual-page"
import { EmpresaPesquisaAnualEditarPage } from "@/pages/empresa-pesquisa-anual-editar-page"
import { EmpresaPesquisaAnualRespostasPage } from "@/pages/empresa-pesquisa-anual-respostas-page"
import { InternoHomePage } from "@/pages/interno-home-page"
import { InternoInicioPage } from "@/pages/interno-inicio-page"
import { InternoEmpresasCadastradasPage } from "@/pages/interno-empresas-cadastradas-page"
import { InternoEmpresaEditarPage } from "@/pages/interno-empresa-editar-page"
import { InternoPesquisaAnualCadastroPage } from "@/pages/interno-pesquisa-anual-cadastro-page"
import { InternoPesquisaAnualLayoutPage } from "@/pages/interno-pesquisa-anual-layout-page"
import { InternoPesquisaAnualPerguntasPage } from "@/pages/interno-pesquisa-anual-perguntas-page"
import { InternoPesquisaAnualRespostasEgressoPage } from "@/pages/interno-pesquisa-anual-respostas-egresso-page"
import { InternoPesquisaAnualRespostasPage } from "@/pages/interno-pesquisa-anual-respostas-page"
import { LoginPage } from "@/pages/login-page"
import { PesquisaAnualPage } from "@/pages/pesquisa-anual-page"
import { SobrePage } from "@/pages/sobre-page"

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Navigate replace to="/home/egresso/curriculo" />} />
      <Route path="/pesquisa/:slug" element={<PesquisaAnualPage />} />
      <Route path="/home/egresso" element={<EgressoHomePage />}>
        <Route index element={<Navigate replace to="curriculo" />} />
        <Route path="curriculo" element={<EgressoCurriculosPage />} />
        <Route path="curriculo/gerar" element={<EgressoCurriculoGerarPage />} />
        <Route path="curriculo/:curriculoId/editar" element={<EgressoCurriculoGerarPage />} />
        <Route path="sobre" element={<SobrePage />} />
        <Route path="configuracoes" element={<EgressoConfiguracoesPage />} />
      </Route>
      <Route path="/home/empresas" element={<EmpresaHomePage />}>
        <Route index element={<Navigate replace to="/home/empresas/candidatos" />} />
        <Route
          path="candidatos"
          element={<EmpresaCandidatosPage />}
        />
        <Route
          path="candidatos/:candidatoId"
          element={<EmpresaCandidatoCurriculoPage />}
        />
        <Route
          path="pesquisa-anual"
          element={<EmpresaPesquisaAnualPage />}
        />
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
        <Route
          path="configuracoes"
          element={<EmpresaConfiguracoesPage />}
        />
      </Route>
      <Route path="/home/interno" element={<InternoHomePage />}>
        <Route
          index
          element={<Navigate replace to="/home/interno/inicio" />}
        />
        <Route path="inicio" element={<InternoInicioPage />} />
        <Route
          path="empresas-cadastradas"
          element={<InternoEmpresasCadastradasPage />}
        />
        <Route
          path="empresas-cadastradas/:empresaId/editar"
          element={<InternoEmpresaEditarPage />}
        />
        <Route path="pesquisa-anual" element={<InternoPesquisaAnualLayoutPage />}>
          <Route index element={<Navigate replace to="/home/interno/pesquisa-anual/perguntas" />} />
          <Route path="perguntas" element={<InternoPesquisaAnualPerguntasPage />} />
          <Route path="respostas" element={<InternoPesquisaAnualRespostasPage />} />
          <Route
            path="respostas/:egressoId"
            element={<InternoPesquisaAnualRespostasEgressoPage />}
          />
        </Route>
        <Route
          path="pesquisa-anual/cadastrar-pergunta"
          element={<InternoPesquisaAnualCadastroPage />}
        />
        <Route
          path="empresas-cadastradas"
          element={<InternoEmpresasCadastradasPage />}
        />
        <Route
          path="empresas-cadastradas/:empresaId/editar"
          element={<InternoEmpresaEditarPage />}
        />
        <Route path="configuracoes" element={<EgressoConfiguracoesPage />} />
      </Route>
      </Route>
    </Routes>
  )
}

export default App
