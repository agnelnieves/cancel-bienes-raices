import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@cancel/ui"

/**
 * Encabezado de sección de producto: tipografía quieta, sin icon-badge decorativo.
 * Título + ayuda opcional + acción de texto.
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
    <div
      className={cn(
        "mb-3 flex flex-wrap items-end justify-between gap-2",
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden
            />
          )}
          <h3 className="font-heading text-[15px] font-semibold tracking-tight">
            {title}
          </h3>
        </div>
        {description && (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {href && actionLabel && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary outline-none transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {actionLabel}
          <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  )
}
