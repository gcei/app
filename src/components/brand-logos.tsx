import { cn } from "@/lib/utils"

type BrandLogosProps = {
  className?: string
  ifalClassName?: string
  cinfoClassName?: string
}

export function BrandLogos({
  className,
  ifalClassName,
  cinfoClassName,
}: BrandLogosProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <img
        src="/logo_ifal.png"
        alt="Instituto Federal de Alagoas"
        className={cn("h-14 w-auto object-contain", ifalClassName)}
      />
      <img
        src="/logo_cinfo.png"
        alt="Coordenação de Informática"
        className={cn("h-16 w-auto object-contain", cinfoClassName)}
      />
    </div>
  )
}
