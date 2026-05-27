import * as React from "react"
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * Input de senha com botão à direita para alternar a visibilidade do texto
 * digitado. Aceita as mesmas props do `Input` (exceto `type`, controlado aqui).
 */
function PasswordInput({
  className,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  const [visivel, setVisivel] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={visivel ? "text" : "password"}
        className={cn("pr-10", className)}
        disabled={disabled}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        disabled={disabled}
        tabIndex={-1}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visivel}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        {visivel ? (
          <EyeSlashIcon aria-hidden="true" />
        ) : (
          <EyeIcon aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
