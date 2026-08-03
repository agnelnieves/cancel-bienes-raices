"use client"

import { BadgeCheck } from "lucide-react"

import { sourceMeta, type PropertySource } from "@cancel/data"
import { Tooltip, TooltipContent, TooltipTrigger, cn } from "@cancel/ui"

/**
 * Sello de fuente/proveniencia de una propiedad.
 * - Cash deals exclusivos: acento `cash` (terracota) + BadgeCheck de verificado.
 * - Fuentes públicas (MLS / Registro / CRIM): chip neutro.
 * Siempre con tooltip que explica de dónde sale la data (confianza).
 */
export function SourceChip({
  source,
  verified = true,
  className,
}: {
  source: PropertySource
  verified?: boolean
  className?: string
}) {
  const meta = sourceMeta[source]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            "inline-flex shrink-0 cursor-help items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            meta.exclusive
              ? "border-cash/30 bg-cash-soft text-cash"
              : "border-border bg-muted text-muted-foreground",
            className
          )}
        >
          {meta.exclusive ? (
            <BadgeCheck className="size-3" aria-hidden />
          ) : null}
          {meta.label}
          {meta.exclusive && verified && (
            <span className="font-medium opacity-80">· Verificado</span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-60 text-xs">
        {meta.description}
        {meta.exclusive && verified && (
          <span className="mt-1 block font-medium">
            Verificado por un realtor de la red.
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
