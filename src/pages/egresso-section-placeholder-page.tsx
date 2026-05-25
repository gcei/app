import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type EgressoSectionPlaceholderPageProps = {
  title: string
  description: string
}

export function EgressoSectionPlaceholderPage({
  title,
  description,
}: EgressoSectionPlaceholderPageProps) {
  return (
    <Card className="border py-0 ring-0 shadow-none">
      <CardHeader className="border-b py-6">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="py-6">
        <p className="text-sm leading-6 text-muted-foreground">
          O conteúdo desta seção será desenvolvido depois.
        </p>
      </CardContent>
    </Card>
  )
}
