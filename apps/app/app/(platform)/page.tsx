"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import {
  activeListings,
  dealStages,
  formatCompact,
  formatCurrency,
  formatNumber,
  formatSigned,
  marketStats,
  recentActivity,
  soldProperties,
  zoneById,
  zones,
} from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import { Sparkline } from "@/components/charts"
import { SparklesIcon } from "@/components/icons"
import { SourceChip } from "@/components/source-chip"
import { useAssistantStore } from "@/lib/stores/assistant"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { useUserStore } from "@/lib/stores/user"

export default function DashboardPage() {
  const router = useRouter()
  const name = useUserStore((s) => s.profile.name)
  const userZones = useUserStore((s) => s.profile.zones)
  const deals = usePipelineStore((s) => s.deals)
  const openAssistant = useAssistantStore((s) => s.setOpen)

  const firstName = name.split(" ")[0] || "inversionista"
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches"

  const activeDeals = deals.filter((d) => d.stage !== "cierre")
  const pipelineValue = activeDeals.reduce((a, d) => a + d.askingPrice, 0)
  const closingDeals = deals.filter((d) => d.stage === "cierre").length
  const avgRoi =
    activeDeals.length > 0
      ? activeDeals.reduce((a, d) => a + d.roi, 0) / activeDeals.length
      : 0

  const stageCounts = dealStages.map((s) => ({
    ...s,
    count: deals.filter((d) => d.stage === s.id).length,
  }))
  const maxStageCount = Math.max(1, ...stageCounts.map((s) => s.count))

  const pulseZones =
    userZones.length > 0
      ? userZones.map(zoneById).filter(Boolean).slice(0, 5)
      : zones.slice(0, 5)

  const cheapestCash = [...soldProperties]
    .filter((p) => p.source === "cash")
    .sort((a, b) => a.price - b.price)
    .slice(0, 2)
  const newestListings = [...activeListings]
    .sort((a, b) => a.daysOnMarket - b.daysOnMarket)
    .slice(0, 1)

  const opportunities = [
    ...cheapestCash.map((p) => ({ kind: "cash" as const, property: p })),
    ...newestListings.map((p) => ({ kind: "listing" as const, property: p })),
  ]

  const today = new Date().toLocaleDateString("es-PR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="animate-fade-in space-y-8">
      {/* ── Page identity ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {today}
          </p>
          <h2 className="mt-1 font-heading text-[26px] font-semibold tracking-tight sm:text-[28px]">
            {greeting}, {firstName}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Pipeline, mercado y oportunidades de la red en un solo lugar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => router.push("/deals")}
          >
            <Plus className="size-3.5" />
            Nuevo deal
          </Button>
          <Button
            size="sm"
            className="rounded-lg"
            onClick={() => router.push("/comparables")}
          >
            <Search className="size-3.5" />
            Buscar comparables
          </Button>
        </div>
      </div>

      {/* ── Command strip: pipeline hero + market signals ─────────────── */}
      <div className="grid gap-3 lg:grid-cols-12">
        {/* Pipeline command panel */}
        <section className="overflow-hidden rounded-xl bg-card shadow-card ring-1 ring-foreground/5 lg:col-span-8 dark:ring-foreground/10">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-6">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Valor del pipeline
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-[34px]">
                  {formatCompact(pipelineValue)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activeDeals.length} activo
                  {activeDeals.length === 1 ? "" : "s"}
                  {closingDeals > 0 ? ` · ${closingDeals} en cierre` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  ROI medio
                </p>
                <p className="mt-0.5 font-heading text-lg font-semibold tabular-nums">
                  {avgRoi > 0 ? `${avgRoi.toFixed(1)}%` : "—"}
                </p>
              </div>
              <Link
                href="/deals"
                className="inline-flex items-center gap-1 rounded-md text-xs font-medium text-primary outline-none transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                Ver deals
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Stage distribution */}
          <div className="border-b border-border/70 px-5 py-3.5 sm:px-6">
            <p className="mb-2.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Por etapa
            </p>
            <div className="grid grid-cols-3 gap-x-3 gap-y-2.5 sm:grid-cols-6">
              {stageCounts.map((s) => (
                <div key={s.id} className="min-w-0" title={s.label}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-1">
                    <span className="truncate text-[10px] text-muted-foreground">
                      {STAGE_SHORT[s.id] ?? s.label}
                    </span>
                    <span className="text-[11px] font-semibold tabular-nums text-foreground">
                      {s.count}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        s.count > 0 ? "bg-primary" : "bg-transparent"
                      )}
                      style={{
                        width: `${(s.count / maxStageCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deal rows */}
          <div className="divide-y divide-border/70">
            {deals.slice(0, 4).map((deal) => (
              <Link
                key={deal.id}
                href="/deals"
                className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40 sm:px-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">
                    {deal.address}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {deal.city} · {formatCompact(deal.askingPrice)} · ROI{" "}
                    <span className="tabular-nums">{deal.roi}%</span>
                  </p>
                </div>
                <StageChip stage={deal.stage} />
                <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
              </Link>
            ))}
          </div>
        </section>

        {/* Market signals — compact stack */}
        <section className="flex flex-col gap-3 lg:col-span-4">
          <SignalTile
            href="/comparables"
            label="Cash deals este mes"
            value={String(marketStats.cashDealsThisMonth)}
            helper="Exclusivos de la red"
            tone="cash"
            delta={`+${marketStats.cashDealsThisMonth}`}
          />
          <SignalTile
            href="/comparables"
            label="Comparables nuevos"
            value={`+${marketStats.newThisWeek}`}
            helper="Añadidos esta semana"
            tone="success"
            delta="esta semana"
          />
          <SignalTile
            href="/comparables"
            label="Base total"
            value={formatNumber(marketStats.totalComparables)}
            helper={`${marketStats.municipalities} municipios · ${marketStats.verifiedRealtors} realtors`}
            tone="neutral"
          />
          <button
            type="button"
            onClick={() => openAssistant(true)}
            className="group flex flex-1 items-start gap-3 rounded-2xl bg-muted px-4 py-3.5 text-left outline-none transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
              <SparklesIcon size={14} className="[&>svg]:block" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold">
                Pregúntale al copiloto
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                Cash flow, cap rate o si un deal en Bayamón tiene sentido.
              </span>
            </span>
            <ArrowRight className="mt-1 size-3.5 shrink-0 text-primary/70 transition-transform group-hover:translate-x-0.5" />
          </button>
        </section>
      </div>

      {/* ── Market pulse — dense table (Fey sector-list energy) ────────── */}
      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-heading text-[15px] font-semibold tracking-tight">
              Pulso del mercado
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Zonas que sigues · precio por pie, momentum y cash share
            </p>
          </div>
          <Link
            href="/comparables"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary outline-none hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            Explorar zonas
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-card shadow-card ring-1 ring-foreground/5 dark:ring-foreground/10">
          {/* Column headers — desktop */}
          <div className="hidden grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.7fr))_88px] gap-3 border-b border-border/70 px-5 py-2.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:px-6">
            <span>Zona</span>
            <span className="text-right">$/pc</span>
            <span className="text-right">YoY</span>
            <span className="text-right">DOM</span>
            <span className="text-right">Cash</span>
            <span className="text-right">Trend</span>
          </div>

          <div className="divide-y divide-border/70">
            {pulseZones.map((z) => {
              if (!z) return null
              const positive = z.yoyChange >= 0
              return (
                <Link
                  key={z.id}
                  href={`/comparables?zona=${z.id}`}
                  className="group grid grid-cols-1 gap-2 px-5 py-3.5 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.7fr))_88px] sm:items-center sm:gap-3 sm:px-6 sm:py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{z.name}</p>
                    <p className="text-[11px] text-muted-foreground">{z.city}</p>
                  </div>

                  <div className="flex items-center justify-between sm:block sm:text-right">
                    <span className="text-[10px] text-muted-foreground uppercase sm:hidden">
                      $/pc
                    </span>
                    <p className="font-heading text-sm font-semibold tabular-nums">
                      ${z.medianPpsf}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end">
                    <span className="text-[10px] text-muted-foreground uppercase sm:hidden">
                      YoY
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 text-[12px] font-semibold tabular-nums",
                        positive ? "text-success" : "text-warning"
                      )}
                    >
                      {positive ? (
                        <TrendingUp className="size-3" aria-hidden />
                      ) : (
                        <TrendingDown className="size-3" aria-hidden />
                      )}
                      {formatSigned(z.yoyChange)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:block sm:text-right">
                    <span className="text-[10px] text-muted-foreground uppercase sm:hidden">
                      DOM
                    </span>
                    <p className="text-[12px] tabular-nums text-muted-foreground">
                      {z.avgDom}d
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:block sm:text-right">
                    <span className="text-[10px] text-muted-foreground uppercase sm:hidden">
                      Cash
                    </span>
                    <p className="text-[12px] tabular-nums text-muted-foreground">
                      {z.cashShare}%
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Sparkline
                      data={z.trend}
                      id={z.id}
                      className="h-8 w-[72px]"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom: radar + activity ──────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-heading text-[15px] font-semibold tracking-tight">
                Para tu radar
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Oportunidades frescas que vale la pena mirar hoy
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-card shadow-card ring-1 ring-foreground/5 dark:ring-foreground/10">
            <div className="divide-y divide-border/70">
              {opportunities.map(({ kind, property: p }) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => router.push("/comparables")}
                  className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors outline-none hover:bg-muted/40 focus-visible:bg-muted/40 sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {kind === "cash" ? (
                        <SourceChip source="cash" verified={p.verified} />
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          <span
                            className="size-1.5 rounded-full bg-primary animate-pulse-dot"
                            aria-hidden
                          />
                          Recién listada · {p.daysOnMarket}d
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        {p.city}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-[13px] font-medium">
                      {p.address}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {formatCurrency(p.price)} · ${p.pricePerSqFt}/pc
                      {kind === "cash" && p.estimatedRent
                        ? ` · renta est. ${formatCurrency(p.estimatedRent)}/mes`
                        : ""}
                    </p>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground",
                      kind === "cash" && "group-hover:text-cash"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <section>
            <div className="mb-3">
              <h3 className="font-heading text-[15px] font-semibold tracking-tight">
                Actividad de la red
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Reportes de realtors e inversionistas
              </p>
            </div>
            <div className="overflow-hidden rounded-xl bg-card shadow-card ring-1 ring-foreground/5 dark:ring-foreground/10">
              <ul className="divide-y divide-border/70">
                {recentActivity.slice(0, 5).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start gap-3 px-4 py-3 sm:px-5"
                  >
                    <span
                      className={cn(
                        "mt-1.5 size-1.5 shrink-0 rounded-full",
                        a.type === "cash"
                          ? "bg-cash"
                          : a.type === "deal"
                            ? "bg-primary"
                            : "bg-muted-foreground/35"
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-foreground/90">
                        {a.message}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {a.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="rounded-xl bg-card px-5 py-4 shadow-card ring-1 ring-foreground/5 dark:ring-foreground/10">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Calculator className="size-4 text-foreground/70" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">¿Vale la pena el deal?</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  Precio y renta en 30 segundos: cap rate, cash flow y break-even
                  en palabras sencillas.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 rounded-lg"
                  onClick={() => router.push("/calculadora")}
                >
                  Abrir calculadora
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignalTile({
  href,
  label,
  value,
  helper,
  tone,
  delta,
}: {
  href: string
  label: string
  value: string
  helper: string
  tone: "cash" | "success" | "neutral"
  delta?: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-3 rounded-xl bg-card px-4 py-3.5 shadow-card ring-1 ring-foreground/5 transition-colors outline-none hover:bg-muted/30 hover:ring-foreground/8 focus-visible:ring-2 focus-visible:ring-ring/40 dark:ring-foreground/10"
    >
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 font-heading text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{helper}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
              tone === "cash" && "bg-cash-soft text-cash",
              tone === "success" && "bg-success-soft text-success",
              tone === "neutral" && "bg-muted text-muted-foreground"
            )}
          >
            {tone !== "neutral" && (
              <TrendingUp className="size-2.5" aria-hidden />
            )}
            {delta}
          </span>
        )}
        <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
      </div>
    </Link>
  )
}

const STAGE_SHORT: Record<string, string> = {
  prospecto: "Prospecto",
  analisis: "Análisis",
  oferta: "Oferta",
  negociacion: "Negoc.",
  "due-diligence": "Due dil.",
  cierre: "Cierre",
}

export function StageChip({ stage }: { stage: string }) {
  const idx = dealStages.findIndex((s) => s.id === stage)
  const label = dealStages.find((s) => s.id === stage)?.label ?? stage
  return (
    <span
      className={cn(
        "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold",
        idx >= 4
          ? "bg-success-soft text-success"
          : idx >= 2
            ? "bg-warning-soft text-warning"
            : "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </span>
  )
}
