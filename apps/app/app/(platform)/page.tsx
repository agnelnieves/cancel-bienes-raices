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
import { SourceChip } from "@/components/source-chip"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { useUserStore } from "@/lib/stores/user"

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
  const avgRoi =
    activeDeals.length > 0
      ? activeDeals.reduce((a, d) => a + d.roi, 0) / activeDeals.length
      : 0

  const stageCounts = dealStages.map((s) => ({
    ...s,
    count: deals.filter((d) => d.stage === s.id).length,
  }))

  const pulseZones =
    userZones.length > 0
      ? userZones.map(zoneById).filter(Boolean).slice(0, 5)
      : zones.slice(0, 5)

  const topZone = pulseZones.find(Boolean)
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
    statusBits.push(
      `${topZone.name} ${formatSigned(topZone.yoyChange)}`
    )
  }

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
    <div className="animate-fade-in space-y-10">
      {/* ── Page identity ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground first-letter:uppercase">
            {today}
          </p>
          <h2 className="mt-1.5 font-heading text-[26px] font-semibold tracking-tight sm:text-[28px]">
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

      {/* ── Pipeline hero (single first-fold story) ───────────────────── */}
      <section className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5 dark:ring-foreground/10">
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 pt-6 pb-5 sm:px-7">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Valor del pipeline</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-heading text-[34px] font-semibold tracking-tight tabular-nums sm:text-4xl">
                {formatCompact(pipelineValue)}
              </p>
              <p className="text-sm text-muted-foreground">
                {activeDeals.length} activo
                {activeDeals.length === 1 ? "" : "s"}
                {closingDeals > 0 ? ` · ${closingDeals} en cierre` : ""}
                {avgRoi > 0 ? (
                  <>
                    {" · "}
                    ROI medio{" "}
                    <span className="font-medium tabular-nums text-foreground">
                      {avgRoi.toFixed(1)}%
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
          <Link
            href="/deals"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary outline-none transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            Ver deals
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Stage distribution — text, not faux progress bars */}
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 border-t border-border/60 px-5 py-3.5 text-[13px] sm:px-7">
          <span className="mr-2 text-muted-foreground">Por etapa</span>
          {stageCounts.map((s, i) => (
            <span key={s.id} className="inline-flex items-center gap-1">
              {i > 0 && (
                <span className="mx-1 text-muted-foreground/40" aria-hidden>
                  ·
                </span>
              )}
              <span className="text-muted-foreground">
                {STAGE_SHORT[s.id] ?? s.label}
              </span>
              <span className="font-semibold tabular-nums text-foreground">
                {s.count}
              </span>
            </span>
          ))}
        </div>

        {/* Deal rows */}
        <div className="border-t border-border/60">
          {deals.slice(0, 4).map((deal) => (
            <Link
              key={deal.id}
              href="/deals"
              className="group flex items-center gap-3 border-b border-border/50 px-5 py-4 last:border-b-0 transition-colors hover:bg-muted/35 sm:px-7"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium tracking-tight">
                  {deal.address}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {deal.city} · {formatCompact(deal.askingPrice)} · ROI{" "}
                  <span className="tabular-nums">{deal.roi}%</span>
                </p>
              </div>
              <StageChip stage={deal.stage} />
              <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Network pulse — one quiet strip, not competing tiles ─────── */}
      <Link
        href="/comparables"
        className="group flex flex-wrap items-center justify-between gap-3 rounded-xl px-1 py-1 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <span className="font-medium text-foreground">Red esta semana</span>
          <span className="text-muted-foreground">
            <span className="tabular-nums text-foreground">
              {marketStats.cashDealsThisMonth}
            </span>{" "}
            cash deals
            <span className="mx-1.5 text-muted-foreground/40">·</span>
            <span className="tabular-nums text-foreground">
              +{marketStats.newThisWeek}
            </span>{" "}
            comps
            <span className="mx-1.5 text-muted-foreground/40">·</span>
            <span className="tabular-nums text-foreground">
              {formatNumber(marketStats.totalComparables)}
            </span>{" "}
            en base
            <span className="mx-1.5 text-muted-foreground/40">·</span>
            {marketStats.municipalities} municipios
          </span>
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

        <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.7fr))_88px] gap-3 border-b border-border/60 px-5 py-3 text-xs text-muted-foreground sm:grid sm:px-6">
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
              return (
                <Link
                  key={z.id}
                  href={`/comparables?zona=${z.id}`}
                  className="group grid grid-cols-1 gap-2 border-b border-border/50 px-5 py-4 last:border-b-0 transition-colors hover:bg-muted/35 sm:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.7fr))_88px] sm:items-center sm:gap-3 sm:px-6"
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
                        "inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums",
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

          <div className="border-t border-border/60">
            {opportunities.map(({ kind, property: p }) => (
              <button
                key={p.id}
                type="button"
                onClick={() => router.push("/comparables")}
                className="group flex w-full items-center gap-3 border-b border-border/50 py-4 text-left transition-colors outline-none hover:bg-muted/30 focus-visible:bg-muted/30"
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
                    <span className="text-sm text-muted-foreground">
                      {p.city}
                    </span>
                  </div>
                  <p className="mt-1.5 truncate text-[15px] font-medium tracking-tight">
                    {p.address}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
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
        </section>

        <div className="flex flex-col gap-10 lg:col-span-5">
          <section>
            <div className="mb-4">
              <h3 className="font-heading text-base font-semibold tracking-tight">
                Actividad de la red
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Reportes de realtors e inversionistas
              </p>
            </div>
            <ul className="border-t border-border/60">
              {recentActivity.slice(0, 5).map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 border-b border-border/50 py-3.5"
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

          <div className="flex items-start gap-3.5 rounded-2xl bg-muted/50 px-5 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-foreground/70 ring-1 ring-foreground/5">
              <Calculator className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">¿Vale la pena el deal?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
        "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium",
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
