import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  egressoJaRespondeuFormAtivo,
  getActiveForm,
  setEgressoAtual,
} from "@/lib/pesquisa-form-storage"

type AccessMode = "egresso" | "empresa"

const accessLabels: Record<AccessMode, string> = {
  egresso: "Sou egresso",
  empresa: "Acesso IFAL",
}

const emailPlaceholders: Record<AccessMode, string> = {
  egresso: "seu.email@exemplo.com",
  empresa: "empresa@dominio.com",
}

export function LoginPage() {
  const navigate = useNavigate()
  const [accessMode, setAccessMode] = useState<AccessMode>("egresso")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const switchMode = () => {
    setAccessMode((mode) => (mode === "egresso" ? "empresa" : "egresso"))
    setEmail("")
    setPassword("")
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (accessMode === "empresa") {
      navigate("/home/empresas")
      return
    }

    const emailNormalizado = email.trim().toLowerCase()
    setEgressoAtual({
      email: emailNormalizado,
      nome: emailNormalizado.split("@")[0] || "Egresso",
    })

    const ativo = getActiveForm()
    const precisaResponder =
      !!ativo &&
      ativo.perguntas.length > 0 &&
      !egressoJaRespondeuFormAtivo(emailNormalizado)

    navigate(precisaResponder ? "/pesquisa-anual" : "/home/egresso")
  }

  const handleForgotPassword = () => {
    // Simular envio de email com instruções
    alert("Instruções enviadas para o seu e-mail cadastrado!")
  }

  return (
    <main className="flex min-h-svh flex-col justify-center gap-8 bg-background px-6 py-6">
      <div></div>
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src="/logo_ifal.png"
            alt="Instituto Federal de Alagoas"
            className="h-20 w-auto"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">GCEI</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Acesse o sistema
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Escolha como deseja acessar o sistema.
            </p>
          </div>
        </div>

        <Card className="mt-10 border border-border/80 bg-card py-0 shadow-sm ring-0">
          <CardContent className="py-6">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  spellCheck={false}
                  placeholder={emailPlaceholders[accessMode]}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  spellCheck={false}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleForgotPassword}
                  >
                    Esqueci minha senha
                  </Button>
                </div>
              </div>

              <Button type="submit" className="mt-1 w-full">
                Entrar
              </Button>

              <div className="flex justify-center pt-1 text-sm text-muted-foreground">
                <Button
                  type="button"
                  variant="link"
                  className="h-auto px-0"
                  onClick={switchMode}
                >
                  {accessMode === "egresso"
                    ? accessLabels.empresa
                    : accessLabels.egresso}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
