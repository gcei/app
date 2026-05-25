import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  AlertDialog,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  egressoJaRespondeuFormAtivo,
  getActiveForm,
  setEgressoAtual,
} from "@/lib/pesquisa-form-storage"

type AccessMode = "egresso" | "empresa"

type AccessConfig = {
  title: string
  submitLabel: string
  fields: Array<{
    id: string
    label: string
    name: string
    type: "text" | "email" | "password"
    autoComplete: string
    placeholder: string
    inputMode?: "text" | "email" | "numeric"
    spellCheck?: boolean
  }>
}

const accessLabels: Record<AccessMode, string> = {
  egresso: "Sou egresso",
  empresa: "Acesso IFAL",
}

const accessModes: Record<AccessMode, AccessConfig> = {
  egresso: {
    title: "Entrar como egresso",
    submitLabel: "Entrar",
    fields: [
      {
        id: "cpf",
        label: "CPF",
        name: "cpf",
        type: "text",
        autoComplete: "off",
        placeholder: "000.000.000-00",
        inputMode: "numeric",
        spellCheck: false,
      },
    ],
  },
  empresa: {
    title: "GCEI",
    submitLabel: "Entrar",
    fields: [
      {
        id: "company-email",
        label: "E-mail",
        name: "email",
        type: "email",
        autoComplete: "username",
        placeholder: "empresa@dominio.com",
        inputMode: "email",
        spellCheck: false,
      },
      {
        id: "company-password",
        label: "Senha",
        name: "password",
        type: "password",
        autoComplete: "current-password",
        placeholder: "Digite sua senha",
        spellCheck: false,
      },
    ],
  },
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)

  if (digits.length <= 3) {
    return digits
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function LoginPage() {
  const navigate = useNavigate()
  const [accessMode, setAccessMode] = useState<AccessMode>("egresso")
  const [cpf, setCpf] = useState("")
  const [captchaOpen, setCaptchaOpen] = useState(false)
  const [captchaChecked, setCaptchaChecked] = useState(false)
  const currentMode = accessModes[accessMode]

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
            <form
              className="flex flex-col gap-5"
              onSubmit={(event) => {
                event.preventDefault()

                if (accessMode === "empresa") {
                  navigate("/home/empresas")
                }
              }}
            >
              {currentMode.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label
                    htmlFor={field.id}
                    className="text-sm font-medium text-foreground"
                  >
                    {field.label}
                  </label>
                  <Input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    spellCheck={field.spellCheck}
                    placeholder={field.placeholder}
                    value={
                      accessMode === "egresso" && field.name === "cpf"
                        ? cpf
                        : undefined
                    }
                    onChange={
                      accessMode === "egresso" && field.name === "cpf"
                        ? (event) => setCpf(formatCpf(event.target.value))
                        : undefined
                    }
                  />
                  {accessMode === "egresso" && field.name === "cpf" ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      Seu CPF será consultado no SISTEC para validar sua
                      condição de egresso do IFAL.
                    </p>
                  ) : null}
                  {accessMode === "empresa" && field.name === "password" ? (
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        variant="link"
                        onClick={() => {
                          // Simular envio de email com instruções
                          alert('Instruções enviadas para o seu e-mail cadastrado!')
                        }}
                      >
                        Esqueci minha senha
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}

              {accessMode === "egresso" ? (
                <AlertDialog
                  open={captchaOpen}
                  onOpenChange={(open) => {
                    setCaptchaOpen(open)
                    if (!open) {
                      setCaptchaChecked(false)
                    }
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button type="button" className="mt-1 w-full">
                      {currentMode.submitLabel}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmação de acesso</AlertDialogTitle>
                      <AlertDialogDescription>
                        Conclua a validação para continuar o acesso.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/40 p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="captcha-stub"
                          checked={captchaChecked}
                          onCheckedChange={(checked) =>
                            setCaptchaChecked(checked === true)
                          }
                        />
                        <label
                          htmlFor="captcha-stub"
                          className="text-sm leading-6 text-foreground"
                        >
                          Confirmo que não sou um robô.
                        </label>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Marque a opção abaixo para prosseguir.
                      </p>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <Button
                        type="button"
                        disabled={!captchaChecked}
                        onClick={() => {
                          setCaptchaOpen(false)

                          const cpfDigits = cpf.replace(/\D/g, "")
                          setEgressoAtual({
                            cpf: cpfDigits,
                            nome: `Egresso ${cpfDigits.slice(-3) || "—"}`,
                          })

                          const ativo = getActiveForm()
                          const precisaResponder =
                            !!ativo &&
                            ativo.perguntas.length > 0 &&
                            !egressoJaRespondeuFormAtivo(cpfDigits)

                          navigate(precisaResponder ? "/pesquisa-anual" : "/home/egresso")
                        }}
                      >
                        Validar captcha
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button type="submit" className="mt-1 w-full">
                  {currentMode.submitLabel}
                </Button>
              )}

              <div className="flex justify-center pt-1 text-sm text-muted-foreground">
                <Button
                  type="button"
                  variant="link"
                  className="h-auto px-0"
                  onClick={() =>
                    setAccessMode(accessMode === "egresso" ? "empresa" : "egresso")
                  }
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
