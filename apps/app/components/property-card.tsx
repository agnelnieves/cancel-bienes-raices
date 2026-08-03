"use client"

import { useRouter } from "next/navigation"
import {
  BedDouble,
  Bookmark,
  Calculator,
  GitCompareArrows,
  Plus,
  Ruler,
  ShowerHead,
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

export function PropertyCard({ property: p }: { property: Property }) {
  const router = useRouter()
  const { savedIds, compareIds, toggleSaved, toggleCompare } = useSavedStore()
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
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cash/0 via-cash to-cash/0" />
      )}
      <CardContent className="p-4 sm:p-5">
        {/* Fuente + estado */}
        <div className="flex flex-wrap items-center gap-1.5">
          <SourceChip source={p.source} verified={p.verified} />
          {isActive && (
            <span className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-info-soft px-2 py-0.5 text-[10px] font-semibold text-info">
              <span className="size-1.5 rounded-full bg-info animate-pulse-dot" aria-hidden />
              En venta · {p.daysOnMarket}d
            </span>
          )}
        </div>

        {/* Dirección + precio */}
        <div className="mt-2.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">
              {p.address}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {p.city} {p.zipCode} · {p.type}
              {!isActive && ` · vendida ${formatDateShort(p.date)}`}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-xl font-bold tracking-tight">
              {formatCurrency(p.price)}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              ${p.pricePerSqFt}/pc
            </p>
          </div>
        </div>

        {/* Specs + renta estimada */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {p.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" aria-hidden />
              {p.bedrooms} hab
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ShowerHead className="size-3.5" aria-hidden />
            {p.bathrooms} baño{p.bathrooms !== 1 ? "s" : ""}
          </span>
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
            variant={saved ? "secondary" : "outline"}
            aria-pressed={saved}
            onClick={() => {
              toggleSaved(p.id)
              toast(saved ? "Quitada de guardadas" : "Guardada en favoritos")
            }}
          >
            <Bookmark className={saved ? "fill-current" : undefined} />
            {saved ? "Guardada" : "Guardar"}
          </Button>
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
