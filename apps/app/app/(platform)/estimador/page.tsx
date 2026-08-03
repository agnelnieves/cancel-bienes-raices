"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Hammer, Info } from "lucide-react"
import { useRouter } from "next/navigation"

import { formatCurrency } from "@cancel/data"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@cancel/ui"

import { useAnalysisStore } from "@/lib/stores/analysis"

// ---------------------------------------------------------------------------
// Partidas con precios PR por nivel de acabado (mano de obra incluida)
// ---------------------------------------------------------------------------

type Tier = "economico" | "estandar" | "premium"

interface ScopeItem {
  id: string
  label: string
  hint: string
  unit: "total" | "sqft" | "bano" | "ventana" | "aire"
  defaultQty?: number
  prices: Record<Tier, number>
}

const SCOPE: ScopeItem[] = [
  { id: "cocina", label: "Cocina completa", hint: "Gabinetes, tope, backsplash, plomería", unit: "total", prices: { economico: 8500, estandar: 12500, premium: 18500 } },
  { id: "bano", label: "Baño remodelado", hint: "Por baño — plato, inodoro, vanidad, losas", unit: "bano", defaultQty: 1, prices: { economico: 3800, estandar: 5500, premium: 8500 } },
  { id: "pisos", label: "Pisos nuevos", hint: "Por pie cuadrado — loseta o vinil", unit: "sqft", prices: { economico: 4.5, estandar: 7, premium: 11 } },
  { id: "pintura-int", label: "Pintura interior", hint: "Por pie cuadrado", unit: "sqft", prices: { economico: 1.6, estandar: 2.2, premium: 3.2 } },
  { id: "pintura-ext", label: "Pintura exterior", hint: "Por pie cuadrado", unit: "sqft", prices: { economico: 1.3, estandar: 1.9, premium: 2.8 } },
  { id: "techo", label: "Techo (sellado/membrana)", hint: "Por pie cuadrado — clima PR exige sellado bueno", unit: "sqft", prices: { economico: 2.2, estandar: 3.5, premium: 5 } },
  { id: "electricidad", label: "Sistema eléctrico", hint: "Panel, salidas, alumbrado — total", unit: "total", prices: { economico: 4500, estandar: 6500, premium: 9500 } },
  { id: "plomeria", label: "Plomería", hint: "Tuberías, calentador, fixtures — total", unit: "total", prices: { economico: 3200, estandar: 4800, premium: 7200 } },
  { id: "ventanas", label: "Ventanas", hint: "Por ventana — seguridad/impacto", unit: "ventana", defaultQty: 6, prices: { economico: 450, estandar: 650, premium: 980 } },
  { id: "aires", label: "Aires mini-split", hint: "Por unidad, instalada", unit: "aire", defaultQty: 2, prices: { economico: 1250, estandar: 1650, premium: 2300 } },
  { id: "puertas", label: "Puertas y cerraduras", hint: "Total — incluye principal de seguridad", unit: "total", prices: { economico: 1400, estandar: 2200, premium: 3600 } },
  { id: "exteriores", label: "Exteriores / marquesina", hint: "Limpieza, epoxy, verja, landscaping básico", unit: "total", prices: { economico: 1800, estandar: 3200, premium: 5500 } },
]

const TIERS: { id: Tier; label: string; hint: string; who: string }[] = [
  { id: "economico", label: "Económico", hint: "Rental básico / C class", who: "Para alquilar a precio accesible sin sobre-invertir." },
  { id: "estandar", label: "Estándar", hint: "Rental bueno / flip medio", who: "El punto dulce para la mayoría de los flips en PR." },
  { id: "premium", label: "Premium", hint: "Flip alto / zona turística", who: "Para vender caro o cobrar más la noche en zona turística." },
]

export default function EstimadorPage() {
  const router = useRouter()
  const { prefill, setPrefill } = useAnalysisStore()

  const [sqft, setSqft] = React.useState(prefill?.sqft ?? 1200)
  const [tier, setTier] = React.useState<Tier>("estandar")
  const [selected, setSelected] = React.useState<Record<string, number>>({
    cocina: 1,
    bano: 1,
    pisos: 1,
    "pintura-int": 1,
    techo: 1,
    aires: 2,
  })

  const toggle = (item: ScopeItem) => {
    setSelected((cur) => {
      const next = { ...cur }
      if (item.id in next) delete next[item.id]
      else next[item.id] = item.defaultQty ?? 1
      return next
    })
  }

  const setQty = (id: string, qty: number) =>
    setSelected((cur) => ({ ...cur, [id]: Math.max(1, qty) }))

  const lines = SCOPE.filter((i) => i.id in selected).map((item) => {
    const qty = selected[item.id]
    const base = item.prices[tier]
    const total =
      item.unit === "sqft" ? base * sqft : item.unit === "total" ? base : base * qty
    return { item, qty, unitPrice: base, total }
  })

  const subtotal = lines.reduce((a, l) => a + l.total, 0)
  const contingency = Math.round(subtotal * 0.1)
  const total = subtotal + contingency
  const weeks = Math.max(2, Math.round(total / 6500))

  const useInCalculator = () => {
    setPrefill({
      ...(prefill ?? {}),
      mode: "flip",
      sqft,
      rehab: total,
    })
    router.push("/calculadora")
  }

  return (
    <div className="grid gap-5 lg:grid-cols-5 animate-fade-in">
      {/* ------------------------------ Configuración ------------------------------ */}
      <div className="space-y-4 lg:col-span-3">
        <Card>
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground">
                Pies cuadrados de la propiedad
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value) || 0)}
                  step={100}
                  className="h-11 rounded-lg pr-12"
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  pc
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground">
                Nivel de acabado
              </Label>
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
                {TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTier(t.id)}
                    aria-pressed={tier === t.id}
                    className={cn(
                      "rounded-lg px-2 py-2 text-xs font-semibold transition-all",
                      tier === t.id
                        ? "bg-card text-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] leading-snug text-muted-foreground">
                <span className="font-medium text-foreground">
                  {TIERS.find((t) => t.id === tier)!.hint}
                </span>{" "}
                · {TIERS.find((t) => t.id === tier)!.who}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Hammer className="size-4 text-primary" />
              Alcance del trabajo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {SCOPE.map((item) => {
              const active = item.id in selected
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item)}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-xl border p-3 text-left transition-all",
                    active
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="min-w-0">
                    <p className={cn("text-[13px] font-medium", active && "text-primary")}>
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      {item.hint}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-transparent"
                    )}
                  >
                    ✓
                  </span>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------ Resultado ------------------------------ */}
      <div className="space-y-4 lg:col-span-2">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/8 to-transparent">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Presupuesto total estimado
            </p>
            <p className="font-heading text-4xl font-extrabold tracking-tight">
              {formatCurrency(total)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Rango realista: {formatCurrency(Math.round(total * 0.9))} –{" "}
              {formatCurrency(Math.round(total * 1.12))}
            </p>
            <div className="mt-3 flex gap-4 text-xs">
              <span className="text-muted-foreground">
                <strong className="text-foreground">
                  {formatCurrency(sqft > 0 ? Math.round(total / sqft) : 0)}
                </strong>{" "}
                por pie cuadrado
              </span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">~{weeks} semanas</strong> de trabajo
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Desglose por partida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            {lines.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Selecciona partidas del alcance para ver el desglose.
              </p>
            )}
            {lines.map(({ item, qty, total: lineTotal }) => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[13px]">{item.label}</span>
                  {item.unit !== "total" && item.unit !== "sqft" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5">
                      <button
                        className="px-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setQty(item.id, qty - 1)}
                      >
                        −
                      </button>
                      <span className="text-[11px] font-semibold">{qty}</span>
                      <button
                        className="px-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setQty(item.id, qty + 1)}
                      >
                        +
                      </button>
                    </span>
                  )}
                  {item.unit === "sqft" && (
                    <span className="text-[11px] text-muted-foreground">
                      × {sqft.toLocaleString()} pc
                    </span>
                  )}
                </div>
                <span className="shrink-0 font-medium">
                  {formatCurrency(Math.round(lineTotal))}
                </span>
              </div>
            ))}
            {lines.length > 0 && (
              <>
                <Separator />
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(Math.round(subtotal))}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    Contingencia (10%)
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="size-3" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-56 text-xs">
                        Siempre suma 10% — en PR los imprevistos (humedad, cables
                        viejos, permisos) son la regla, no la excepción.
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span>{formatCurrency(contingency)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <span className="font-semibold">Total</span>
                  <span className="font-heading text-lg font-bold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Button
          className="w-full"
          size="lg"
          disabled={lines.length === 0}
          onClick={useInCalculator}
        >
          Usar en la calculadora de flip
          <ArrowRight className="size-4" />
        </Button>

        <Link href="/contratistas" className="block">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/6 to-transparent transition-all hover:border-primary/40 hover:shadow-soft">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                  <Hammer className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold">
                    ¿Quién ejecuta el trabajo?
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Contratistas vetados por la comunidad (lic. + seguro)
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-primary" />
            </CardContent>
          </Card>
        </Link>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          Precios de referencia con mano de obra de PR (2026). Consigue siempre
          2–3 cotizaciones de contratistas.
        </p>
      </div>
    </div>
  )
}
