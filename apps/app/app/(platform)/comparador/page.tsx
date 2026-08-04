"use client"

import * as React from "react"
import Link from "next/link"
import { CircleHelp, Plus, Trophy, X } from "lucide-react"

import { GitCompareIcon, SearchIcon, SparklesIcon } from "@/components/icons"

import {
  formatCompact,
  formatCurrency,
  formatDateShort,
  properties,
  propertyById,
  sourceMeta,
  zoneById,
  type Property,
} from "@cancel/data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Slider,
  cn,
} from "@cancel/ui"

import { useSavedStore, MAX_COMPARE } from "@/lib/stores/saved"

const CONDITION_SCORE: Record<string, number> = {
  Excelente: 1,
  Buena: 0.8,
  "Necesita reparos": 0.55,
  "Para remodelar": 0.3,
}

interface Weights {
  precio: number
  roi: number
  condicion: number
  liquidez: number
}

const WEIGHT_META: { id: keyof Weights; label: string; hint: string }[] = [
  { id: "precio", label: "Precio vs. zona", hint: "$/pc comparado con la mediana de la zona" },
  { id: "roi", label: "Retorno estimado", hint: "Renta anual bruta ÷ precio" },
  { id: "condicion", label: "Condición", hint: "Estado físico de la propiedad" },
  { id: "liquidez", label: "Liquidez", hint: "Qué tan rápido se mueve (DOM)" },
]

function grossYield(p: Property): number {
  return ((p.estimatedRent * 12) / p.price) * 100
}

function scoreProperties(list: Property[], w: Weights) {
  const totalWeight = w.precio + w.roi + w.condicion + w.liquidez || 1
  const raw = list.map((p) => {
    const zone = zoneById(p.zone)
    const vsZone = zone ? zone.medianPpsf / p.pricePerSqFt : 1 // >1 = mejor que la zona
    const roi = grossYield(p)
    const cond = CONDITION_SCORE[p.condition] ?? 0.5
    const liq = Math.max(0, 1 - p.daysOnMarket / 90)
    return { p, vsZone, roi, cond, liq }
  })
  const norm = (vals: number[]) => {
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    return vals.map((v) => (max === min ? 1 : (v - min) / (max - min)))
  }
  const nVs = norm(raw.map((r) => r.vsZone))
  const nRoi = norm(raw.map((r) => r.roi))
  const nCond = norm(raw.map((r) => r.cond))
  const nLiq = norm(raw.map((r) => r.liq))

  return raw.map((r, i) => {
    const score =
      ((nVs[i] * w.precio + nRoi[i] * w.roi + nCond[i] * w.condicion + nLiq[i] * w.liquidez) /
        totalWeight) *
      100
    return { ...r, score: Math.round(score) }
  })
}

/** Contexto en español llano para cada número — responde "¿y eso es bueno?" */
function yieldVerdict(y: number): { text: string; good: boolean } {
  if (y >= 8) return { text: "por encima del típico en PR (8%)", good: true }
  return { text: "por debajo del típico en PR (8%)", good: false }
}

export default function ComparadorPage() {
  const { compareIds, toggleCompare } = useSavedStore()
  const [weights, setWeights] = React.useState<Weights>({
    precio: 40,
    roi: 30,
    condicion: 15,
    liquidez: 15,
  })
  const [addOpen, setAddOpen] = React.useState(false)

  const list = compareIds
    .map(propertyById)
    .filter(Boolean) as Property[]
  const scored = React.useMemo(() => scoreProperties(list, weights), [list, weights])
  const best = scored.length > 1 ? scored.reduce((a, b) => (a.score >= b.score ? a : b)) : null
  const bestId = best?.p.id ?? null

  if (list.length === 0) return <EmptyState />

  const bestZone = best ? zoneById(best.p.zone) : null
  const bestVsZone =
    best && bestZone
      ? Math.round(((best.p.pricePerSqFt - bestZone.medianPpsf) / bestZone.medianPpsf) * 100)
      : null

  const rows: { label: string; render: (p: Property) => React.ReactNode }[] = [
    { label: "Precio", render: (p) => <strong>{formatCurrency(p.price)}</strong> },
    { label: "$ por pie cuadrado", render: (p) => `$${p.pricePerSqFt}` },
    { label: "vs. mediana de zona", render: (p) => {
        const z = zoneById(p.zone)
        if (!z) return "—"
        const diff = Math.round(((p.pricePerSqFt - z.medianPpsf) / z.medianPpsf) * 100)
        return (
          <span className="inline-flex flex-wrap items-center gap-x-1.5">
            <Badge variant={diff <= 0 ? "success" : "warning"}>
              {diff > 0 ? "+" : ""}{diff}%
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {diff <= 0 ? "bajo la zona" : "sobre la zona"}
            </span>
          </span>
        )
      } },
    { label: "Cuartos / baños", render: (p) => `${p.bedrooms}h / ${p.bathrooms}b` },
    { label: "Tamaño", render: (p) => `${p.sqFt.toLocaleString()} pc` },
    { label: "Año", render: (p) => p.yearBuilt },
    { label: "Condición", render: (p) => p.condition },
    { label: "Renta estimada", render: (p) => `${formatCurrency(p.estimatedRent)}/mes` },
    { label: "Yield bruto", render: (p) => {
        const y = grossYield(p)
        const v = yieldVerdict(y)
        return (
          <span className="inline-flex flex-wrap items-center gap-x-1.5">
            <Badge variant={v.good ? "success" : "warning"}>{y.toFixed(1)}%</Badge>
            <span className="text-[10px] text-muted-foreground">{v.text}</span>
          </span>
        )
      } },
    { label: "Días en mercado", render: (p) => (
        <span>
          {p.daysOnMarket}d{" "}
          <span className="text-[10px] text-muted-foreground">
            {p.daysOnMarket <= 30 ? "· se mueve rápido" : p.daysOnMarket <= 60 ? "· ritmo normal" : "· lento, hay espacio pa' negociar"}
          </span>
        </span>
      ) },
    { label: "Fuente", render: (p) => (
        <Badge variant={p.source === "cash" ? "cash" : "outline"}>
          {sourceMeta[p.source].short}
          {p.source === "cash" && " · Exclusivo"}
        </Badge>
      ) },
    { label: "Fecha", render: (p) => formatDateShort(p.date) },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Veredicto primero — la recomendación en español llano */}
      {best && (
        <Card className="border-success/30 bg-success-soft/60 shadow-card">
          <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success text-success-foreground">
              <Trophy className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-balance">
                Nuestra recomendación: {best.p.address}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                Score {best.score}/100 con tus prioridades
                {bestVsZone !== null && bestVsZone < 0 && (
                  <> · {Math.abs(bestVsZone)}% bajo la mediana de {bestZone?.name}</>
                )}
                <> · yield {best.roi.toFixed(1)}%</>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pesos del scoring */}
      <Card className="shadow-card">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">¿Qué pesa más para ti?</p>
            <p className="text-[11px] text-muted-foreground">
              El score se recalcula en vivo
            </p>
          </div>
          <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {WEIGHT_META.map((w) => (
              <div key={w.id}>
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] font-medium">{w.label}</Label>
                  <span className="text-xs font-semibold text-primary">
                    {weights[w.id]}%
                  </span>
                </div>
                <Slider
                  value={[weights[w.id]]}
                  onValueChange={([v]) => setWeights((cur) => ({ ...cur, [w.id]: v }))}
                  max={60}
                  step={5}
                  className="mt-2"
                  aria-label={w.label}
                />
                <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
                  {w.hint}
                </p>
              </div>
            ))}
          </div>

          {/* Transparencia: cómo se calcula el score */}
          <Accordion type="single" collapsible className="mt-3 rounded-xl border border-border bg-muted/40 px-3.5">
            <AccordionItem value="como" className="border-b-0">
              <AccordionTrigger className="py-3 text-[12px] font-medium hover:no-underline">
                <span className="inline-flex items-center gap-2">
                  <CircleHelp className="size-3.5 text-primary" />
                  ¿Cómo lo calculamos?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3.5">
                <ol className="space-y-2 text-[12px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">1.</span>
                    Medimos las 4 cosas que importan: precio vs. la zona, retorno
                    estimado, condición y qué tan rápido se vende.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">2.</span>
                    Cada métrica se escala de 0 a 100 comparando solo las
                    propiedades que tienes en la mesa — la mejor saca 100.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">3.</span>
                    Tus sliders deciden cuánto pesa cada una. El score es la suma
                    con esos pesos. Sin caja negra.
                  </li>
                </ol>
                <p className="mt-2.5 rounded-lg bg-card p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                  Es una ayuda para decidir, no una tasación. Antes de ofertar,
                  valida con inspección y los comparables de la zona.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Tabla comparativa */}
      <div className="overflow-x-auto pb-2">
        <div
          className="grid min-w-max gap-3"
          style={{ gridTemplateColumns: `150px repeat(${Math.min(list.length + 1, MAX_COMPARE)}, minmax(200px, 1fr))` }}
        >
          {/* Header de propiedades */}
          <div />
          {scored.map(({ p, score }) => (
            <Card
              key={p.id}
              className={cn(
                "relative overflow-hidden shadow-card",
                p.id === bestId && "border-success/50 shadow-soft"
              )}
            >
              {p.id === bestId && (
                <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-1.5 bg-success py-1.5 text-[10px] font-bold tracking-wide text-success-foreground">
                  <Trophy className="size-3" />
                  MEJOR DEAL — TE LO RECOMENDAMOS
                </div>
              )}
              <CardContent className={cn("p-4", p.id === bestId && "pt-9")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{p.address}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{p.city}</p>
                  </div>
                  <button
                    onClick={() => toggleCompare(p.id)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Quitar ${p.address}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="font-heading text-lg font-bold">{formatCompact(p.price)}</p>
                  <div className="text-right">
                    <p className={cn(
                      "font-heading text-2xl font-extrabold",
                      p.id === bestId ? "text-success" : "text-foreground"
                    )}>
                      {score}
                    </p>
                    <p className="text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
                      score
                    </p>
                  </div>
                </div>
                {/* Barra de score */}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", p.id === bestId ? "bg-success" : "bg-muted-foreground/40")}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {list.length < MAX_COMPARE && (
            <button
              onClick={() => setAddOpen(true)}
              className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-5" />
              <span className="text-xs font-medium">Añadir propiedad</span>
            </button>
          )}

          {/* Filas de métricas */}
          {rows.map((row) => (
            <React.Fragment key={row.label}>
              <div className="flex items-center border-t border-border py-3 text-[11px] font-medium text-muted-foreground">
                {row.label}
              </div>
              {scored.map(({ p }) => (
                <div
                  key={p.id}
                  className={cn(
                    "flex items-center border-t border-border px-4 py-3 text-[13px]",
                    p.id === bestId && "bg-success/[0.05]"
                  )}
                >
                  {row.render(p)}
                </div>
              ))}
              {list.length < MAX_COMPARE && (
                <div className="border-t border-border" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Dialog añadir */}
      <AddPropertyDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="border-dashed shadow-card">
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center sm:py-20">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-success-soft text-success">
          <GitCompareIcon size={26} className="[&>svg]:block" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">Pon dos o más propiedades cara a cara</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            En el buscador de comparables toca <strong>Comparar</strong> en hasta{" "}
            {MAX_COMPARE} propiedades y aquí te decimos cuál es la mejor jugada,
            con el score explicado paso a paso.
          </p>
        </div>

        {/* Muestra de cómo se verá */}
        <div className="flex items-end gap-3" aria-hidden="true">
          {[62, 88, 45].map((h, i) => (
            <div key={i} className="flex w-16 flex-col items-center gap-1.5">
              <div className="flex h-20 w-full items-end rounded-lg bg-muted/70 p-1">
                <div
                  className={cn(
                    "w-full rounded-md",
                    i === 1 ? "bg-success/70" : "bg-muted-foreground/25"
                  )}
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className={cn("text-[10px] font-semibold", i === 1 ? "text-success" : "text-muted-foreground")}>
                {i === 1 ? "Mejor" : "—"}
              </span>
            </div>
          ))}
        </div>

        <Button asChild className="mt-1">
          <Link href="/comparables" className="inline-flex items-center gap-2">
            <SearchIcon size={16} className="[&>svg]:block" />
            Buscar comparables
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function AddPropertyDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { compareIds, toggleCompare } = useSavedStore()
  const [q, setQ] = React.useState("")
  const results = properties
    .filter((p) => !compareIds.includes(p.id))
    .filter(
      (p) =>
        !q ||
        `${p.address} ${p.city}`.toLowerCase().includes(q.toLowerCase())
    )
    .slice(0, 8)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon size={16} className="text-primary [&>svg]:block" />
            Añadir al comparador
          </DialogTitle>
        </DialogHeader>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca por dirección o zona…"
          className="rounded-full"
          autoFocus
        />
        <div className="max-h-80 space-y-1.5 overflow-y-auto">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                toggleCompare(p.id)
                onOpenChange(false)
              }}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{p.address}</p>
                <p className="text-[11px] text-muted-foreground">
                  {p.city} · ${p.pricePerSqFt}/pc
                </p>
              </div>
              <span className="shrink-0 font-heading text-sm font-bold">
                {formatCompact(p.price)}
              </span>
            </button>
          ))}
          {results.length === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground">
              Sin resultados
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
