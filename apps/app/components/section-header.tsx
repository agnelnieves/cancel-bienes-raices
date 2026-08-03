import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@cancel/ui"

/**
 * Encabezado de sección consistente para las páginas de la plataforma.
 * Título claro + una línea de ayuda en lenguaje sencillo + acción opcional.
 */
export function SectionHeader({
  icon: Icon,
  title,
  description,
  href,
  actionLabel,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  href?: string
  actionLabel?: string
  className?: string
}) {
  return (
    <div className={cn("mb-3 flex flex-wrap items-end justify-between gap-2", className)}>
      <div className="flex items-start gap-2.5">
        {Icon && (
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-3.5 text-primary" />
          </span>
        )}
        <div>
          <h3 className="font-heading text-base font-bold tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {href && actionLabel && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-md text-xs font-medium text-primary outline-none transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {actionLabel}
          <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  )
}
