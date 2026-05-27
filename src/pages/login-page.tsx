import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { ApiError } from "@/lib/api/http"

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const user = await login({
        email: email.trim().toLowerCase(),
        password,
      })

      // ADMIN = staff IFAL → área de empresas.
      if (user.role === "ADMIN") {
        navigate("/home/interno", { replace: true })
        return
      }

      // STUDENT = egresso. A pesquisa é acessada por link (slug), não há
      // descoberta de "form ativo" na API (/forms é admin-only).
      navigate("/home/egresso", { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("E-mail ou senha inválidos.")
      } else if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Não foi possível entrar. Tente novamente.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = () => {
    // Simular envio de email com instruções (reset de senha ainda não
    // implementado no backend — POST /auth/reset-password responde 501).
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
              Entre com seu e-mail e senha.
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
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={submitting}
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
                  disabled={submitting}
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

              {error ? (
                <p
                  role="alert"
                  className="text-sm font-medium text-destructive"
                >
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="mt-1 w-full" disabled={submitting}>
                {submitting ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
