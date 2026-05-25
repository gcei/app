import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  addResposta,
  getActiveForm,
  getEgressoAtual,
} from "@/lib/pesquisa-form-storage"

export function PesquisaAnualPage() {
  const navigate = useNavigate()
  const form = useMemo(() => getActiveForm(), [])
  const egresso = useMemo(() => getEgressoAtual(), [])
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const answeredAllQuestions = !!form && form.perguntas.every((p) => answers[p.id])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!answeredAllQuestions || !form) return

    if (egresso) {
      addResposta({
        formId: form.id,
        egressoCpf: egresso.cpf,
        egressoNome: egresso.nome,
        respostas: answers,
      })
    }

    navigate("/home/egresso")
  }

  return (
    <main className="min-h-svh bg-background px-6 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            {form?.titulo ?? "Pesquisa do egresso"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Atualize suas informações antes de continuar
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {form?.descricao ?? ""}
          </p>
        </header>

        <Card className="border py-0 ring-0 shadow-none">
          <CardHeader className="border-b py-6">
            <CardTitle>Questionário</CardTitle>
          </CardHeader>

          <CardContent className="py-6">
            {!form || form.perguntas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  Nenhuma pergunta disponível
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  O formulário ainda não possui perguntas cadastradas.
                </p>
                <div className="mt-4 flex justify-center">
                  <Button type="button" onClick={() => navigate("/home/egresso")}>
                    Continuar
                  </Button>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {form!.perguntas.map((question, index) => (
                  <div key={question.id} className="flex flex-col gap-4">
                    {index > 0 ? <Separator /> : null}

                    <div className="flex flex-col gap-3 pt-1">
                      <fieldset className="flex flex-col gap-3">
                        <legend className="text-base font-medium text-foreground">
                          {`${index + 1}. ${question.enunciado}`}
                        </legend>

                        <RadioGroup
                          value={answers[question.id]}
                          onValueChange={(value) =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: value,
                            }))
                          }
                        >
                          {question.opcoes.map((option) => {
                            const optionId = `${question.id}-${option
                              .toLowerCase()
                              .replaceAll(/[^\p{L}\p{N}]+/gu, "-")
                              .replace(/^-|-$/g, "")}`

                            return (
                              <label
                                key={optionId}
                                htmlFor={optionId}
                                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/40"
                              >
                                <RadioGroupItem id={optionId} value={option} />
                                <span className="text-sm leading-6 text-foreground">
                                  {option}
                                </span>
                              </label>
                            )
                          })}
                        </RadioGroup>
                      </fieldset>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-muted-foreground">
                    Todas as perguntas são obrigatórias.
                  </p>

                  <Button type="submit" disabled={!answeredAllQuestions}>
                    Enviar respostas
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
