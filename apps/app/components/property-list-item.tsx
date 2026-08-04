"use client"

import {
  BedDouble,
  Bookmark,
  GitCompareArrows,
  Ruler,
  ShowerHead,
} from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  formatDateShort,
  type Property,
} from "@cancel/data"
import { cn } from "@cancel/ui"

import { SourceChip } from "@/components/source-chip"
import { useSavedStore } from "@/lib/stores/saved"

/**
 * Dense row for the comparables split-pane list (store-locator energy).
 * Highlights when selected; hovers highlight the map pin via parent.
 */
export function PropertyListItem({
  property: p,
  selected,
  onSelect,
}: {
  property: Property
  selected?: boolean
  onSelect?: (id: string) => void
}) {
  const { savedIds, compareIds, toggleSaved, toggleCompare } = useSavedStore()
  const saved = savedIds.includes(p.id)
  const comparing = compareIds.includes(p.id)
  const isActive = p.status === "active"
  const drop =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(p.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.(p.id)
        }
      }}
      className={cn(
        "group w-full cursor-pointer border-b border-border/70 px-3.5 py-3 text-left outline-none transition-colors",
        "hover:bg-muted/45 focus-visible:bg-muted/45",
        selected && "bg-primary/[0.07] hover:bg-primary/[0.09]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className="font-heading text-[15px] font-semibold tracking-tight tabular-nums">
              {formatCurrency(p.price)}
            </p>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              ${p.pricePerSqFt}/pc
            </span>
            {drop !== null && (
              <span className="text-[10px] font-semibold text-success">
                −{drop}%
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[13px] font-medium">{p.address}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {p.city} · {p.type}
            {!isActive && ` · ${formatDateShort(p.date)}`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleSaved(p.id)
              toast(saved ? "Quitada de guardadas" : "Guardada")
            }}
            aria-label={saved ? "Quitar de guardadas" : "Guardar"}
            className={cn(
              "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              saved && "text-primary"
            )}
          >
            <Bookmark className={cn("size-3.5", saved && "fill-current")} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              const ok = toggleCompare(p.id)
              if (ok)
                toast(
                  comparing ? "Quitada del comparador" : "Añadida al comparador"
                )
              else toast.error("Máximo 5 en el comparador")
            }}
            aria-label={comparing ? "Quitar del comparador" : "Comparar"}
            className={cn(
              "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              comparing && "bg-secondary text-foreground"
            )}
          >
            <GitCompareArrows className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <SourceChip source={p.source} verified={p.verified} />
        {isActive && (
          <span className="inline-flex items-center gap-1 rounded-md bg-info-soft px-1.5 py-0.5 text-[10px] font-semibold text-info">
            <span
              className="size-1.5 rounded-full bg-info animate-pulse-dot"
              aria-hidden
            />
            En venta · {p.daysOnMarket}d
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-muted-foreground">
        {p.bedrooms > 0 && (
          <span className="inline-flex items-center gap-1">
            <BedDouble className="size-3" aria-hidden />
            {p.bedrooms}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <ShowerHead className="size-3" aria-hidden />
          {p.bathrooms}
        </span>
        <span className="inline-flex items-center gap-1">
          <Ruler className="size-3" aria-hidden />
          {p.sqFt.toLocaleString()} pc
        </span>
        <span className="ml-auto tabular-nums font-medium text-foreground/80">
          {formatCurrency(p.estimatedRent)}
          <span className="font-normal text-muted-foreground">/mes</span>
        </span>
      </div>
    </div>
  )
}
