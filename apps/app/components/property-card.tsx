"use client"

import { useRouter } from "next/navigation"
import {
  BedDouble,
  Bookmark,
  Calculator,
  GitCompareArrows,
  Home,
  Plus,
  Ruler,
  ShowerHead,
  TrendingDown,
} from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  formatDateShort,
  sourceMeta,
  type Property,
} from "@cancel/data"
import { Button, Card, CardContent, cn } from "@cancel/ui"

import { SourceChip } from "@/components/source-chip"
import { useAnalysisStore } from "@/lib/stores/analysis"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { useSavedStore } from "@/lib/stores/saved"

/** Placeholder on-brand para la foto — gradiente cálido + icono, no finge foto real */
function PropertyImage({ p, saved }: { p: Property; saved: boolean }) {
  const isCash = sourceMeta[p.source].exclusive
  const isActive = p.status === "active"
  const drop =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : null

  return (
    <div
      className={cn(
        "relative flex h-40 items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-accent via-muted to-secondary"
      )}
      aria-hidden
    >
      {/* grano/patrones sutil */}
      <div className="absolute inset-0 opacity-[0.4] [background:radial-gradient(circle_at_30%_20%,var(--primary)/12%,transparent_55%)]" />
      <Home className="size-10 text-primary/25" strokeWidth={1.5} />

      {/* Badges overlaid — top-left: lo urgente */}
      <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
        {isCash && (
          <span className="inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold text-cash shadow-soft backdrop-blur-sm">
            Cash deal · Exclusivo
          </span>
        )}
        {drop !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-soft backdrop-blur-sm">
            <TrendingDown className="size-3 text-primary" />
            Bajó {drop}%
          </span>
        )}
        {isActive && !drop && p.daysOnMarket <= 7 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-soft backdrop-blur-sm">
            Recién listada
          </span>
        )}
      </div>

      {/* Guardar — top-right */}
      <SaveButton id={p.id} saved={saved} />
    </div>
  )
}

function SaveButton({ id, saved }: { id: string; saved: boolean }) {
  const toggleSaved = useSavedStore((s) => s.toggleSaved)
  return (
    <button
      onClick={() => {
        toggleSaved(id)
        toast(saved ? "Quitada de guardadas" : "Guardada en favoritos")
      }}
      aria-pressed={saved}
      aria-label={saved ? "Quitar de guardadas" : "Guardar en favoritos"}
      className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft backdrop-blur-sm transition-all hover:scale-105 hover:bg-card"
    >
      <Bookmark
        className={cn("size-4", saved && "fill-primary text-primary")}
      />
    </button>
  )
}

export function PropertyCard({ property: p }: { property: Property }) {
  const router = useRouter()
  const { savedIds, compareIds, toggleCompare } = useSavedStore()
  const addDeal = usePipelineStore((s) => s.addDeal)
  const setPrefill = useAnalysisStore((s) => s.setPrefill)

  const saved = savedIds.includes(p.id)
  const comparing = compareIds.includes(p.id)
  const meta = sourceMeta[p.source]
  const isActive = p.status === "active"

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lift",
        meta.exclusive && "ring-cash/25"
      )}
    >
      {meta.exclusive && (
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-cash/0 via-cash to-cash/0" />
      )}

      {/* Imagen con badges overlaid */}
      <PropertyImage p={p} saved={saved} />

      <CardContent className="p-4 sm:p-5">
        {/* Precio primero — lo más importante (Zillow) */}
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-heading text-2xl font-bold tracking-tight">
            {formatCurrency(p.price)}
          </p>
          <p className="text-[11px] font-medium text-muted-foreground">
            ${p.pricePerSqFt}/pc
          </p>
        </div>
        {p.originalPrice && p.originalPrice > p.price && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="line-through">{formatCurrency(p.originalPrice)}</span>
            <span className="ml-1.5 font-semibold text-success">
              bajó {formatCurrency(p.originalPrice - p.price)}
            </span>
          </p>
        )}

        {/* Dirección */}
        <div className="mt-2 min-w-0">
          <h3 className="truncate text-[14px] font-semibold tracking-tight">
            {p.address}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {p.city} {p.zipCode} · {p.type}
            {!isActive && ` · vendida ${formatDateShort(p.date)}`}
          </p>
        </div>

        {/* Fuente + estado */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <SourceChip source={p.source} verified={p.verified} />
          {isActive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" aria-hidden />
              En venta · {p.daysOnMarket}d
            </span>
          )}
        </div>

        {/* Specs en una línea — ritmo de escaneo uniforme */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {p.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" aria-hidden />
              {p.bedrooms} hab
            </span>
          )}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <ShowerHead className="size-3.5" aria-hidden />
            {p.bathrooms} baño{p.bathrooms !== 1 ? "s" : ""}
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Ruler className="size-3.5" aria-hidden />
            {p.sqFt.toLocaleString()} pc
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/70 px-3 py-2">
          <span className="text-[11px] font-medium text-muted-foreground">
            Renta estimada
          </span>
          <span className="text-[13px] font-semibold text-foreground">
            {formatCurrency(p.estimatedRent)}
            <span className="text-[11px] font-normal text-muted-foreground">
              /mes
            </span>
          </span>
        </div>

        {/* Acciones */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Button
            size="xs"
            variant={comparing ? "secondary" : "outline"}
            aria-pressed={comparing}
            onClick={() => {
              const ok = toggleCompare(p.id)
              if (ok)
                toast(comparing ? "Quitada del comparador" : "Añadida al comparador")
              else toast.error("Máximo 5 propiedades en el comparador")
            }}
          >
            <GitCompareArrows />
            {comparing ? "Comparando" : "Comparar"}
          </Button>
          <Button
            size="xs"
            onClick={() => {
              setPrefill({
                propertyId: p.id,
                address: p.address,
                zone: p.zone,
                mode: "alquiler",
                price: p.price,
                sqft: p.sqFt,
                rent: p.estimatedRent,
                strNightly: p.strNightlyRate,
              })
              router.push("/calculadora")
            }}
          >
            <Calculator />
            Analizar
          </Button>
          <Button
            size="xs"
            variant="outline"
            className="ml-auto"
            onClick={() => {
              addDeal({
                address: p.address,
                city: p.city,
                stage: "prospecto",
                askingPrice: p.price,
                offerPrice: null,
                roi: 0,
                cashFlow: 0,
                notes: `Fuente: ${meta.label}. Renta est. ${formatCurrency(p.estimatedRent)}/mes.`,
                contactName: "",
                contactRole: "",
              })
              toast.success("Añadida al pipeline")
            }}
          >
            <Plus />
            Pipeline
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
