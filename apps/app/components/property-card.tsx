"use client"

import { useRouter } from "next/navigation"
import {
  BadgeCheck,
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
import { Button, Card, CardContent, Tooltip, TooltipContent, TooltipTrigger, cn } from "@cancel/ui"

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
        meta.exclusive && "border-primary/30"
      )}
    >
      {meta.exclusive && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
      )}
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      meta.exclusive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {meta.exclusive && <BadgeCheck className="size-3" />}
                    {meta.label}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-60 text-xs">
                  {meta.description}
                </TooltipContent>
              </Tooltip>
              {isActive && (
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                  En venta · {p.daysOnMarket}d
                </span>
              )}
            </div>
            <h3 className="mt-2 truncate text-[15px] font-semibold tracking-tight">
              {p.address}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {p.city} {p.zipCode} · {p.type}
              {!isActive && ` · vendida ${formatDateShort(p.date)}`}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-lg font-bold tracking-tight">
              {formatCurrency(p.price)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              ${p.pricePerSqFt}/pc
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {p.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" /> {p.bedrooms}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ShowerHead className="size-3.5" /> {p.bathrooms}
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler className="size-3.5" /> {p.sqFt.toLocaleString()} pc
          </span>
          <span className="ml-auto font-medium text-foreground/80">
            Renta est. {formatCurrency(p.estimatedRent)}/mes
          </span>
        </div>

        {/* Acciones */}
        <div className="mt-4 flex gap-1.5">
          <Button
            size="xs"
            variant={saved ? "secondary" : "outline"}
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
            variant="outline"
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
