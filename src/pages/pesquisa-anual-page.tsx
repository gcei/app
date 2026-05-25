import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useFormFill, useSubmitFormFill } from "@/hooks/api/use-forms"
import { ApiError } from "@/lib/api/http"

export function PesquisaAnualPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const fillQuery = useFormFill(slug)
  const submit = useSubmitFormFill(slug ?? "")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const form = fillQuery.data
  const [now] = useState(() => Date.now())
  const notOpenYet = form ? now < new Date(form.opensAt).getTime() : false
  const closed =
    form && form.closesAt ? now > new Date(form.closesAt).getTime() : false

  const answeredAll = useMemo(
    () => !!form && form.questions.every((q) => answers[q.id]),
    [form, answers],
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form || !slug || !answeredAll) return
    setError(null)
    submit.mutate(
      {
        answers: form.questions.map((q) => ({
          questionId: q.id,
          optionId: answers[q.id],
        })),
      },
      {
        onSuccess: () => navigate("/home/egresso", { replace: true }),
        onError: (err) => {
          if (err instanceof ApiError && err.status === 409) {
            setError("Você já respondeu esta pesquisa.")
          } else if (err instanceof ApiError && err.status === 403) {
            setError("Esta pesquisa não está disponível para envio.")
          } else {
            setError("Não foi possível enviar suas respostas. Tente novamente.")
          }
        },
      },
    )
  }

  return (
    <main className="min-h-svh bg-background px-6 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {fillQuery.isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Carregando pesquisa…
          </p>
        ) : fillQuery.isError || !form ? (
          <Card>
            <CardHeader>
              <CardTitle>Pesquisa não encontrada</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                O link da pesquisa é inválido ou expirou.
              </p>
              <Button
                variant="outline"
                className="self-start"
                onClick={() => navigate("/home/egresso")}
              >
                Voltar
              </Button>
            </CardContent>
          </Card>
        ) : form.alreadySubmitted ? (
          <Card>
            <CardHeader>
              <CardTitle>{form.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Você já respondeu esta pesquisa. Obrigado pela participação!
              </p>
              <Button
                variant="outline"
                className="self-start"
                onClick={() => navigate("/home/egresso")}
              >
                Voltar
              </Button>
            </CardContent>
          </Card>
        ) : notOpenYet || closed ? (
          <Card>
            <CardHeader>
              <CardTitle>{form.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {notOpenYet
                  ? "Esta pesquisa ainda não está aberta para respostas."
                  : "O período de respostas desta pesquisa foi encerrado."}
              </p>
              <Button
                variant="outline"
                className="self-start"
                onClick={() => navigate("/home/egresso")}
              >
                Voltar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <header className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pesquisa do egresso
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {form.title}
              </h1>
            </header>

            <div className="flex flex-col gap-6">
              {form.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {index + 1}. {question.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={answers[question.id] ?? ""}
                      onValueChange={(value) =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: value,
                        }))
                      }
                      className="flex flex-col gap-3"
                    >
                      {question.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 rounded-lg border p-3 text-sm"
                        >
                          <RadioGroupItem value={option.id} />
                          <span>{option.title}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>

            {error ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}

            <Separator />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/home/egresso")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!answeredAll || submit.isPending}>
                {submit.isPending ? "Enviando…" : "Enviar respostas"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
