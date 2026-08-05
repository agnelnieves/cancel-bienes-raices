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
  formatCurrency,
  formatNumber,
  formatSigned,
  marketStats,
  recentActivity,
  soldProperties,
  zoneById,
  zones,
  type Deal,
  type DealStage,
} from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import { Sparkline } from "@/components/charts"
import { PipelineHero } from "@/components/dashboard/pipeline-hero"
import { SourceChip } from "@/components/source-chip"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { useUserStore } from "@/lib/stores/user"

const STAGE_INDEX = Object.fromEntries(
  dealStages.map((s, i) => [s.id, i])
) as Record<DealStage, number>

export default function DashboardPage() {
  const router = useRouter()
  const name = useUserStore((s) => s.profile.name)
  const userZones = useUserStore((s) => s.profile.zones)
  const deals = usePipelineStore((s) => s.deals)

  const firstName = name.split(" ")[0] || "inversionista"
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches"

  const activeDeals = deals.filter((d) => d.stage !== "cierre")
  const pipelineValue = activeDeals.reduce((a, d) => a + d.askingPrice, 0)
  const closingDeals = deals.filter((d) => d.stage === "cierre").length
  const dealsWithRoi = activeDeals.filter((d) => d.roi > 0)
  const avgRoi =
    dealsWithRoi.length > 0
      ? dealsWithRoi.reduce((a, d) => a + d.roi, 0) / dealsWithRoi.length
      : 0
  const pipelineCashFlow = activeDeals.reduce(
    (a, d) => a + (d.cashFlow || 0),
    0
  )

  const stageCounts = dealStages.map((s) => ({
    ...s,
    count: deals.filter((d) => d.stage === s.id).length,
  }))
  const stageTotal = stageCounts.reduce((a, s) => a + s.count, 0) || 1

  const focusDeal = pickFocusDeal(activeDeals)

  const pulseZones =
    userZones.length > 0
      ? userZones.map(zoneById).filter(Boolean).slice(0, 5)
      : zones.slice(0, 5)

  const topZone = pulseZones.find(Boolean)
  const hottestZone = [...pulseZones]
    .filter(Boolean)
    .sort((a, b) => (b?.yoyChange ?? 0) - (a?.yoyChange ?? 0))[0]

  const statusBits: string[] = []
  if (activeDeals.length > 0) {
    statusBits.push(
      `${activeDeals.length} deal${activeDeals.length === 1 ? "" : "s"} en movimiento`
    )
  } else if (deals.length > 0) {
    statusBits.push("Pipeline listo para el próximo deal")
  } else {
    statusBits.push("Añade tu primer deal al pipeline")
  }
  if (topZone) {
    statusBits.push(`${topZone.name} ${formatSigned(topZone.yoyChange)}`)
  }

  const cheapestCash = [...soldProperties]
    .filter((p) => p.source === "cash")
    .sort((a, b) => a.price - b.price)
    .slice(0, 2)
  const newestListings = [...activeListings]
    .sort((a, b) => a.daysOnMarket - b.daysOnMarket)
    .slice(0, 2)

  const opportunities = [
    ...cheapestCash.map((p) => ({ kind: "cash" as const, property: p })),
    ...newestListings.map((p) => ({ kind: "listing" as const, property: p })),
  ].slice(0, 4)

  const today = new Date().toLocaleDateString("es-PR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="animate-fade-in space-y-9">
      {/* ── Page identity ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground first-letter:uppercase">
            {today}
          </p>
          <h2 className="mt-1.5 font-heading text-[26px] font-bold tracking-tight sm:text-[28px]">
            {greeting}, {firstName}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {statusBits.join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            className="rounded-lg"
            onClick={() => router.push("/comparables")}
          >
            <Search className="size-3.5" />
            Buscar comparables
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => router.push("/deals")}
          >
            <Plus className="size-3.5" />
            Nuevo deal
          </Button>
        </div>
      </div>

      <PipelineHero
        deals={deals}
        activeDeals={activeDeals}
        pipelineValue={pipelineValue}
        pipelineCashFlow={pipelineCashFlow}
        closingDeals={closingDeals}
        avgRoi={avgRoi}
        stageCounts={stageCounts}
        stageTotal={stageTotal}
        focusDeal={focusDeal}
      />

      {/* ── Network pulse ─────────────────────────────────────────────── */}
      <Link
        href="/comparables"
        className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-muted/55 px-5 py-4 outline-none transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring/40 sm:px-6"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Red esta semana</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <NetworkStat
              value={String(marketStats.cashDealsThisMonth)}
              label="cash deals"
              accent="cash"
            />
            <NetworkStat
              value={`+${marketStats.newThisWeek}`}
              label="comps"
            />
            <NetworkStat
              value={formatNumber(marketStats.totalComparables)}
              label="en base"
            />
            <NetworkStat
              value={String(marketStats.municipalities)}
              label="municipios"
            />
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary/80">
          Explorar
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>

      {/* ── Market pulse ──────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-heading text-base font-semibold tracking-tight">
              Pulso del mercado
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Zonas que sigues · precio por pie, momentum y cash share
            </p>
          </div>
          <Link
            href="/comparables"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary outline-none hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            Explorar zonas
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {hottestZone && (
          <Link
            href={`/comparables?zona=${hottestZone.id}`}
            className="group mb-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card px-5 py-4 shadow-card outline-none transition-colors hover:bg-muted/25 focus-visible:ring-2 focus-visible:ring-ring/40 sm:px-6"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">
                Mayor momentum entre tus zonas
              </p>
              <p className="mt-1 font-heading text-lg font-semibold tracking-tight">
                {hottestZone.name}
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  {hottestZone.city}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground">
                  ${hottestZone.medianPpsf}/pc
                </span>
                <span className="mx-1.5 text-muted-foreground/40">·</span>
                DOM {hottestZone.avgDom}d
                <span className="mx-1.5 text-muted-foreground/40">·</span>
                {hottestZone.cashShare}% cash
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p
                  className={cn(
                    "inline-flex items-center gap-1 font-heading text-2xl font-bold tabular-nums tracking-tight",
                    hottestZone.yoyChange >= 0 ? "text-success" : "text-warning"
                  )}
                >
                  {hottestZone.yoyChange >= 0 ? (
                    <TrendingUp className="size-5" aria-hidden />
                  ) : (
                    <TrendingDown className="size-5" aria-hidden />
                  )}
                  {formatSigned(hottestZone.yoyChange)}
                </p>
                <p className="text-[11px] text-muted-foreground">YoY</p>
              </div>
              <Sparkline
                data={hottestZone.trend}
                id={`hot-${hottestZone.id}`}
                className="h-12 w-28"
              />
            </div>
          </Link>
        )}

        <div className="overflow-hidden rounded-2xl shadow-card">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.7fr))_96px] gap-3 border-b border-border/60 px-5 py-3 text-xs text-muted-foreground sm:grid sm:px-6">
            <span>Zona</span>
            <span className="text-right">$/pc</span>
            <span className="text-right">YoY</span>
            <span className="text-right">DOM</span>
            <span className="text-right">Cash</span>
            <span className="text-right">Trend</span>
          </div>

          <div>
            {pulseZones.map((z) => {
              if (!z) return null
              const positive = z.yoyChange >= 0
              const isHot = hottestZone?.id === z.id
              return (
                <Link
                  key={z.id}
                  href={`/comparables?zona=${z.id}`}
                  className={cn(
                    "group grid grid-cols-1 gap-2 border-b border-border/50 px-5 py-4 last:border-b-0 transition-colors hover:bg-muted/35 sm:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.7fr))_96px] sm:items-center sm:gap-3 sm:px-6",
                    isHot && "bg-accent/30"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium tracking-tight">
                      {z.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{z.city}</p>
                  </div>

                  <div className="flex items-center justify-between sm:block sm:text-right">
                    <span className="text-xs text-muted-foreground sm:hidden">
                      $/pc
                    </span>
                    <p className="font-heading text-sm font-semibold tabular-nums">
                      ${z.medianPpsf}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end">
                    <span className="text-xs text-muted-foreground sm:hidden">
                      YoY
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-sm font-semibold tabular-nums",
                        positive
                          ? "bg-success-soft text-success"
                          : "bg-warning-soft text-warning"
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
                    <span className="text-xs text-muted-foreground sm:hidden">
                      DOM
                    </span>
                    <p className="text-sm tabular-nums text-muted-foreground">
                      {z.avgDom}d
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:block sm:text-right">
                    <span className="text-xs text-muted-foreground sm:hidden">
                      Cash
                    </span>
                    <p className="text-sm tabular-nums text-muted-foreground">
                      {z.cashShare}%
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Sparkline
                      data={z.trend}
                      id={z.id}
                      className="h-9 w-[88px]"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom: radar + activity ──────────────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="mb-4">
            <h3 className="font-heading text-base font-semibold tracking-tight">
              Para tu radar
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Oportunidades frescas que vale la pena mirar hoy
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-card">
            {opportunities.map(({ kind, property: p }) => {
              const drop =
                p.originalPrice && p.originalPrice > p.price
                  ? Math.round(
                      ((p.originalPrice - p.price) / p.originalPrice) * 100
                    )
                  : null
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => router.push("/comparables")}
                  className={cn(
                    "group flex w-full items-center gap-3 border-b border-border/50 px-5 py-4 text-left transition-colors outline-none last:border-b-0 hover:bg-muted/35 focus-visible:bg-muted/35 sm:px-6",
                    kind === "cash" && "bg-cash-soft/40 hover:bg-cash-soft/60"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {kind === "cash" ? (
                        <SourceChip source="cash" verified={p.verified} />
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          <span
                            className="size-1.5 rounded-full bg-primary animate-pulse-dot"
                            aria-hidden
                          />
                          Recién listada · {p.daysOnMarket}d
                        </span>
                      )}
                      {drop !== null && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                          <TrendingDown className="size-3" />
                          Bajó {drop}%
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {p.city}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-[15px] font-medium tracking-tight">
                      {p.address}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <span className="font-medium tabular-nums text-foreground">
                        {formatCurrency(p.price)}
                      </span>
                      <span className="mx-1.5 text-muted-foreground/40">·</span>
                      ${p.pricePerSqFt}/pc
                      {p.estimatedRent > 0 && (
                        <>
                          <span className="mx-1.5 text-muted-foreground/40">
                            ·
                          </span>
                          renta est. {formatCurrency(p.estimatedRent)}/mes
                        </>
                      )}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    {p.estimatedRent > 0 && p.price > 0 && (
                      <>
                        <p className="font-heading text-sm font-semibold tabular-nums">
                          {(
                            ((p.estimatedRent * 12) / p.price) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          cap est.
                        </p>
                      </>
                    )}
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground",
                      kind === "cash" && "group-hover:text-cash"
                    )}
                  />
                </button>
              )
            })}
          </div>
        </section>

        <div className="flex flex-col gap-8 lg:col-span-5">
          <section>
            <div className="mb-4">
              <h3 className="font-heading text-base font-semibold tracking-tight">
                Actividad de la red
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Reportes de realtors e inversionistas
              </p>
            </div>
            <ul className="overflow-hidden rounded-2xl shadow-card">
              {recentActivity.slice(0, 5).map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 border-b border-border/50 px-5 py-3.5 last:border-b-0 sm:px-5"
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
                    <p className="text-sm leading-snug text-foreground/90">
                      {a.message}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-2xl bg-card px-5 py-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                  <Calculator className="size-3.5" />
                  Calculadora ROI
                </span>
                <p className="mt-2.5 text-sm font-semibold tracking-tight">
                  ¿Vale la pena el deal?
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Cap rate, cash flow y break-even en palabras sencillas. 30
                  segundos.
                </p>
                <Button
                  size="sm"
                  className="mt-3.5 rounded-lg"
                  onClick={() => router.push("/calculadora")}
                >
                  Abrir calculadora
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-[11px] text-muted-foreground">Ejemplo</p>
                <p className="font-heading text-2xl font-bold tracking-tight tabular-nums">
                  $1,223
                  <span className="text-sm font-medium text-muted-foreground">
                    /mes
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NetworkStat({
  value,
  label,
  accent,
}: {
  value: string
  label: string
  accent?: "cash"
}) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span
        className={cn(
          "font-heading text-lg font-bold tabular-nums tracking-tight",
          accent === "cash" ? "text-cash" : "text-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </span>
  )
}

function pickFocusDeal(activeDeals: Deal[]): Deal | undefined {
  if (activeDeals.length === 0) return undefined
  return [...activeDeals].sort((a, b) => {
    const stageDiff =
      (STAGE_INDEX[b.stage] ?? 0) - (STAGE_INDEX[a.stage] ?? 0)
    if (stageDiff !== 0) return stageDiff
    if (a.nextStep && !b.nextStep) return -1
    if (!a.nextStep && b.nextStep) return 1
    if (b.roi !== a.roi) return b.roi - a.roi
    return (b.cashFlow || 0) - (a.cashFlow || 0)
  })[0]
}

/** Re-export for any old imports */
export { StageChip } from "@/components/dashboard/pipeline-hero"
