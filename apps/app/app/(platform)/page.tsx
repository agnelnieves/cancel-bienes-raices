"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  Building2,
  Calculator,
  KanbanSquare,
  Plus,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import {
  activeListings,
  dealStages,
  formatCompact,
  formatCurrency,
  formatSigned,
  marketStats,
  recentActivity,
  soldProperties,
  zoneById,
  zones,
} from "@cancel/data"
import { Button, Card, CardContent, CardHeader, CardTitle, cn } from "@cancel/ui"

import { Sparkline } from "@/components/charts"
import { SectionHeader } from "@/components/section-header"
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

  const pulseZones =
    userZones.length > 0
      ? userZones.map(zoneById).filter(Boolean).slice(0, 4)
      : zones.slice(0, 4)

  // Sugerencias "inteligentes" derivadas de la data
  const cheapestCash = [...soldProperties]
    .filter((p) => p.source === "cash")
    .sort((a, b) => a.price - b.price)
    .slice(0, 2)
  const newestListings = [...activeListings]
    .sort((a, b) => a.daysOnMarket - b.daysOnMarket)
    .slice(0, 1)

  const kpis = [
    {
      label: "Deals activos",
      value: String(activeDeals.length),
      helper:
        closingDeals > 0
          ? `Propiedades que estás evaluando — ${closingDeals} ya en cierre`
          : "Propiedades que estás evaluando o negociando",
      icon: KanbanSquare,
      href: "/deals",
    },
    {
      label: "Valor del pipeline",
      value: formatCompact(pipelineValue),
      helper: "Lo que suman tus deals activos al precio pedido",
      icon: Building2,
      href: "/deals",
    },
    {
      label: "Cash deals reportados",
      value: String(marketStats.cashDealsThisMonth),
      helper: "Ventas en cash de este mes que solo ves aquí",
      icon: BadgeDollarSign,
      href: "/comparables",
      cash: true,
    },
    {
      label: "Comparables nuevos",
      value: `+${marketStats.newThisWeek}`,
      helper: "Propiedades añadidas esta semana a tu mercado",
      icon: TrendingUp,
      href: "/comparables",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Saludo + acción principal */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-[28px]">
            {greeting}, {firstName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("es-PR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            · Esto es lo que se está moviendo en tu mercado
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => router.push("/comparables")}>
            <Search className="size-3.5" />
            Buscar comparables
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/deals")}>
            <Plus className="size-3.5" />
            Nuevo deal
          </Button>
        </div>
      </div>

      {/* KPIs — con explicación en palabras sencillas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}>
            <Card className="h-full transition-all hover:border-primary/30 hover:shadow-soft">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </p>
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg",
                      kpi.cash ? "bg-cash-soft" : "bg-primary/10"
                    )}
                  >
                    <kpi.icon
                      className={cn(
                        "size-3.5",
                        kpi.cash ? "text-cash" : "text-primary"
                      )}
                    />
                  </span>
                </div>
                <p className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  {kpi.value}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  {kpi.helper}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pulso del mercado */}
      <section>
        <SectionHeader
          icon={TrendingUp}
          title="Pulso del mercado"
          description="Cómo se están moviendo los precios en las zonas que sigues"
          href="/comparables"
          actionLabel="Explorar zonas"
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pulseZones.map((z) => (
            <Link key={z!.id} href={`/comparables?zona=${z!.id}`}>
              <Card className="h-full transition-all hover:border-primary/30 hover:shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{z!.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {z!.city}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        z!.yoyChange >= 5
                          ? "bg-success-soft text-success"
                          : z!.yoyChange < 0
                            ? "bg-warning-soft text-warning"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {z!.yoyChange < 0 ? (
                        <TrendingDown className="size-3" aria-hidden />
                      ) : (
                        <TrendingUp className="size-3" aria-hidden />
                      )}
                      {formatSigned(z!.yoyChange)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="font-heading text-xl font-bold">
                        ${z!.medianPpsf}
                        <span className="text-xs font-medium text-muted-foreground">
                          /pc
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {z!.avgDom} días en mercado · {z!.cashShare}% cash
                      </p>
                    </div>
                    <Sparkline data={z!.trend} id={z!.id} className="h-10 w-20" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Sugerencias del copiloto */}
        <section className="lg:col-span-3">
          <SectionHeader
            icon={Sparkles}
            title="Para tu radar"
            description="Oportunidades frescas que vale la pena mirar hoy"
          />
          <div className="space-y-3">
            {cheapestCash.map((p) => (
              <Card
                key={p.id}
                className="group cursor-pointer transition-all hover:border-cash/40 hover:shadow-soft"
                onClick={() => router.push("/comparables")}
              >
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <SourceChip source="cash" verified={p.verified} />
                      <span className="text-[11px] text-muted-foreground">
                        {p.city}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-sm font-medium">
                      {p.address}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatCurrency(p.price)} · ${p.pricePerSqFt}/pc · renta
                      est. {formatCurrency(p.estimatedRent)}/mes
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cash" />
                </CardContent>
              </Card>
            ))}
            {newestListings.map((p) => (
              <Card
                key={p.id}
                className="group cursor-pointer transition-all hover:border-info/40 hover:shadow-soft"
                onClick={() => router.push("/comparables")}
              >
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-info-soft px-2 py-0.5 text-[10px] font-semibold text-info">
                        <span className="size-1.5 rounded-full bg-info animate-pulse-dot" aria-hidden />
                        Recién listada · {p.daysOnMarket}d
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {p.city}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-sm font-medium">
                      {p.address}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatCurrency(p.price)} · ${p.pricePerSqFt}/pc ·
                      pregúntale al copiloto si vale la pena
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-info" />
                </CardContent>
              </Card>
            ))}

            {/* Entrada al copiloto — cálida y clara */}
            <button
              onClick={() => openAssistant(true)}
              className="group flex w-full items-center gap-3.5 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 to-transparent p-4 text-left transition-all outline-none hover:border-primary/40 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <Sparkles className="size-4.5 text-primary" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  ¿No sabes por dónde empezar?
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  Pregúntale al copiloto — “¿cuánto cash flow da una casa de
                  $150K en Bayamón?” — y te lo explica en palabras sencillas.
                </span>
              </span>
              <ArrowRight className="ml-auto size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>

        {/* Pipeline + actividad */}
        <div className="space-y-6 lg:col-span-2">
          <section>
            <SectionHeader
              icon={KanbanSquare}
              title="Tu pipeline"
              description="Tus deals y en qué etapa va cada uno"
              href="/deals"
              actionLabel="Ver todo"
            />
            <Card>
              <CardContent className="divide-y divide-border p-0">
                {deals.slice(0, 4).map((deal) => (
                  <Link
                    key={deal.id}
                    href="/deals"
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">
                        {deal.address}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatCompact(deal.askingPrice)} · ROI {deal.roi}%
                      </p>
                    </div>
                    <StageChip stage={deal.stage} />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </section>

          <section>
            <SectionHeader
              title="Actividad de la red"
              description="Lo que otros inversionistas y realtors están reportando"
            />
            <div className="space-y-2.5">
              {recentActivity.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-2.5 text-[13px]">
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      a.type === "cash" ? "bg-cash" : "bg-muted-foreground/40"
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="leading-snug text-foreground/85">{a.message}</p>
                    <p className="text-[11px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/8 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calculator className="size-4 text-primary" />
                ¿Vale la pena el deal?
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Entra el precio y la renta — en 30 segundos te dice si el deal
                tiene sentido, en palabras sencillas. Para alquiler, flip o
                Airbnb.
              </p>
              <Button
                size="sm"
                className="mt-3 w-full"
                onClick={() => router.push("/calculadora")}
              >
                Abrir calculadora
                <ArrowRight className="size-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function StageChip({ stage }: { stage: string }) {
  const idx = dealStages.findIndex((s) => s.id === stage)
  const label = dealStages.find((s) => s.id === stage)?.label ?? stage
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
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
