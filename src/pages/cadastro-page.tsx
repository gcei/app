import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/AuthContext"
import { ApiError } from "@/lib/api/http"
import {
  isValidPhone,
  maskPhone,
  onlyDigits,
  PHONE_INVALID_MESSAGE,
  PHONE_MAX_LENGTH,
} from "@/lib/phone"

export function CadastroPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    phoneNumber: "",
  })
  const [available, setAvailable] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: event.target.value }))

  // Telefone usa máscara dinâmica BR e teclado numérico no mobile.
  const updatePhone = (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, phoneNumber: maskPhone(event.target.value) }))

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    // Telefone é obrigatório neste cadastro: precisa ter 10 ou 11 dígitos.
    const phoneDigits = onlyDigits(form.phoneNumber)
    if (phoneDigits.length === 0 || !isValidPhone(phoneDigits)) {
      setError(PHONE_INVALID_MESSAGE)
      return
    }

    setSubmitting(true)

    try {
      // Cadastro público é sempre de egresso (STUDENT).
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "STUDENT",
        city: form.city.trim(),
        // Envia apenas os dígitos; a máscara é puramente visual.
        phoneNumber: phoneDigits,
        available,
      })
      navigate("/home/egresso", { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Já existe uma conta com este e-mail.")
      } else if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Não foi possível criar a conta. Tente novamente.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col justify-center gap-8 bg-background px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src="/logo_ifal.png"
            alt="Instituto Federal de Alagoas"
            className="h-20 w-auto"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">GCEI</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Criar conta
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Cadastre-se como egresso para gerenciar seus currículos.
            </p>
          </div>
        </div>

        <Card className="mt-8 border border-border/80 bg-card py-0 shadow-sm ring-0">
          <CardContent className="py-6">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <Field id="cadastro-nome" label="Nome">
                <Input
                  id="cadastro-nome"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Seu nome completo"
                  disabled={submitting}
                  required
                />
              </Field>

              <Field id="cadastro-email" label="E-mail">
                <Input
                  id="cadastro-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  value={form.email}
                  onChange={update("email")}
                  placeholder="seu.email@exemplo.com"
                  disabled={submitting}
                  required
                />
              </Field>

              <Field id="cadastro-senha" label="Senha">
                <PasswordInput
                  id="cadastro-senha"
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Crie uma senha"
                  disabled={submitting}
                  required
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="cadastro-cidade" label="Cidade">
                  <Input
                    id="cadastro-cidade"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={update("city")}
                    placeholder="Ex.: Maceió"
                    disabled={submitting}
                    required
                  />
                </Field>

                <Field id="cadastro-telefone" label="Telefone">
                  <Input
                    id="cadastro-telefone"
                    name="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phoneNumber}
                    onChange={updatePhone}
                    placeholder="(00) 00000-0000"
                    maxLength={PHONE_MAX_LENGTH}
                    disabled={submitting}
                    required
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="cadastro-disponivel"
                  checked={available}
                  onCheckedChange={setAvailable}
                  disabled={submitting}
                />
                <label
                  htmlFor="cadastro-disponivel"
                  className="text-sm font-medium text-foreground"
                >
                  Disponível para oportunidades
                </label>
              </div>

              {error ? (
                <p role="alert" className="whitespace-pre-line text-sm font-medium text-destructive">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="mt-1 w-full" disabled={submitting}>
                {submitting ? "Criando conta…" : "Criar conta"}
              </Button>

              <div className="flex justify-center text-sm text-muted-foreground">
                <span>
                  Já tem conta?{" "}
                  <NavLink
                    to="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Entrar
                  </NavLink>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
