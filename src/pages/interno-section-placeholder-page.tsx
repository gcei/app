import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type InternoSectionPlaceholderPageProps = {
  title: string
  description: string
}

export function InternoSectionPlaceholderPage({
  title,
  description,
}: InternoSectionPlaceholderPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          O conteúdo desta seção será desenvolvido nas próximas etapas do protótipo.
        </p>
      </CardContent>
    </Card>
  )
}
