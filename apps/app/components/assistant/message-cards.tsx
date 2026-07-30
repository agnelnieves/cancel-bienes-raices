"use client"

import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Calculator,
  GitCompareArrows,
  Plus,
} from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  formatDateShort,
  sourceMeta,
  type Property,
} from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import type { AssistantCard } from "@/lib/assistant/types"
import { useAnalysisStore } from "@/lib/stores/analysis"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { useSavedStore } from "@/lib/stores/saved"

export function CardRenderer({ card }: { card: AssistantCard }) {
  if (card.type === "properties") return <PropertiesCard card={card} />
  if (card.type === "nav") return <NavCard card={card} />
  return <StatsCard card={card} />
}

// ---------------------------------------------------------------------------

function PropertiesCard({
  card,
}: {
  card: Extract<AssistantCard, { type: "properties" }>
}) {
  return (
    <div className="mt-3 space-y-2">
      {card.title && (
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {card.title}
        </p>
      )}
      {card.properties.map((p) => (
        <PropertyRow key={p.id} property={p} />
      ))}
    </div>
  )
}

function PropertyRow({ property: p }: { property: Property }) {
  const router = useRouter()
  const { savedIds, compareIds, toggleSaved, toggleCompare } = useSavedStore()
  const addDeal = usePipelineStore((s) => s.addDeal)
  const setPrefill = useAnalysisStore((s) => s.setPrefill)
  const saved = savedIds.includes(p.id)
  const comparing = compareIds.includes(p.id)
  const meta = sourceMeta[p.source]

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{p.address}</p>
          <p className="text-xs text-muted-foreground">{p.city}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold">{formatCurrency(p.price)}</p>
          <p className="text-[11px] text-muted-foreground">
            ${p.pricePerSqFt}/pc
          </p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
            meta.exclusive
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {meta.exclusive && <BadgeCheck className="size-3" />}
          {meta.label}
        </span>
        <span className="text-muted-foreground">
          {p.bedrooms}h · {p.bathrooms}b · {p.sqFt.toLocaleString()} pc ·{" "}
          {formatDateShort(p.date)}
        </span>
      </div>

      <div className="mt-2.5 flex gap-1.5">
        <Button
          size="xs"
          variant={saved ? "secondary" : "outline"}
          onClick={() => {
            toggleSaved(p.id)
            toast(saved ? "Quitada de guardadas" : "Guardada en tus favoritos")
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
            if (ok) toast(comparing ? "Quitada del comparador" : "Añadida al comparador")
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
          onClick={() => {
            addDeal({
              address: p.address,
              city: p.city,
              stage: "prospecto",
              askingPrice: p.price,
              contactName: "",
              contactRole: "",
              notes: `Añadida desde el asistente. Fuente: ${meta.label}. Renta est. ${formatCurrency(p.estimatedRent)}/mes.`,
              roi: 0,
              cashFlow: 0,
              offerPrice: null,
            })
            toast.success("Añadida al pipeline como prospecto")
          }}
        >
          <Plus />
          Pipeline
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function NavCard({
  card,
}: {
  card: Extract<AssistantCard, { type: "nav" }>
}) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(card.href)}
      className="group mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 p-3 text-left transition-colors hover:bg-primary/10"
    >
      <div>
        <p className="text-sm font-medium text-primary">{card.label}</p>
        {card.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {card.description}
          </p>
        )}
      </div>
      <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
    </button>
  )
}

// ---------------------------------------------------------------------------

function StatsCard({
  card,
}: {
  card: Extract<AssistantCard, { type: "stats" }>
}) {
  return (
    <div className="mt-3 rounded-xl border border-border bg-card p-3">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {card.title}
      </p>
      <div className="mt-2 space-y-1.5">
        {card.items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="flex items-center gap-2">
              <span className="font-semibold">{item.value}</span>
              {item.delta && (
                <span className="text-xs font-medium text-primary">
                  {item.delta}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
