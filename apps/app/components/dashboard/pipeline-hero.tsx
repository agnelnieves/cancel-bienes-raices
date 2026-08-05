"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react"

import {
  dealStages,
  formatCompact,
  formatCurrency,
  type Deal,
  type DealStage,
} from "@cancel/data"
import { Button, cn } from "@cancel/ui"

const STAGE_SHORT: Record<string, string> = {
  prospecto: "Prospecto",
  analisis: "Análisis",
  oferta: "Oferta",
  negociacion: "Negoc.",
  "due-diligence": "Due dil.",
  cierre: "Cierre",
}

const STAGE_BAR: Record<DealStage, string> = {
  prospecto: "bg-foreground/12",
  analisis: "bg-foreground/20",
  oferta: "bg-primary/35",
  negociacion: "bg-primary/55",
  "due-diligence": "bg-primary/75",
  cierre: "bg-primary",
}

export type StageCount = {
  id: DealStage
  label: string
  count: number
}

export type PipelineHeroProps = {
  deals: Deal[]
  activeDeals: Deal[]
  pipelineValue: number
  pipelineCashFlow: number
  closingDeals: number
  avgRoi: number
  stageCounts: StageCount[]
  stageTotal: number
  focusDeal: Deal | undefined
}

/**
 * First-fold pipeline: focus action card (left) + pipeline overview (right).
 */
export function PipelineHero({
  deals,
  activeDeals,
  pipelineValue,
  pipelineCashFlow,
  closingDeals,
  avgRoi,
  stageCounts,
  stageTotal,
  focusDeal,
}: PipelineHeroProps) {
  const router = useRouter()
  const next =
    focusDeal &&
    (focusDeal.nextStep ||
      defaultNextStep(focusDeal.stage, focusDeal.city))

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
      {/* Left — next action */}
      <section className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-card lg:col-span-5">
        {focusDeal ? (
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <span className="inline-flex w-fit items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
              Tu próximo paso
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StageChip stage={focusDeal.stage} />
              <span className="text-sm text-muted-foreground">
                {focusDeal.city}
              </span>
            </div>
            <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight">
              {focusDeal.address}
            </h3>
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed">
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="text-muted-foreground">Acción: </span>
                <span className="font-medium">{next}</span>
              </span>
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <MetricTile
                label="Asking"
                value={formatCompact(focusDeal.askingPrice)}
              />
              {focusDeal.offerPrice != null && (
                <MetricTile
                  label="Oferta"
                  value={formatCompact(focusDeal.offerPrice)}
                />
              )}
              {focusDeal.cashFlow > 0 && (
                <MetricTile
                  label="Cash flow"
                  value={
                    <>
                      {formatCurrency(focusDeal.cashFlow)}
                      <span className="text-xs font-medium text-muted-foreground">
                        /mes
                      </span>
                    </>
                  }
                />
              )}
              {focusDeal.roi > 0 && (
                <MetricTile label="ROI" value={`${focusDeal.roi}%`} />
              )}
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              <Button
                size="sm"
                className="rounded-lg"
                onClick={() => router.push("/deals")}
              >
                Abrir deal
                <ArrowRight className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg"
                onClick={() => router.push("/calculadora")}
              >
                Correr números
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-start justify-center p-5 sm:p-6">
            <p className="text-sm font-semibold">Sin deal en foco</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Añade un deal al pipeline para ver el próximo paso aquí.
            </p>
            <Button
              size="sm"
              className="mt-4 rounded-lg"
              onClick={() => router.push("/deals")}
            >
              <Plus className="size-3.5" />
              Nuevo deal
            </Button>
          </div>
        )}
      </section>

      {/* Right — pipeline overview + list */}
      <section className="overflow-hidden rounded-2xl bg-card shadow-card lg:col-span-7">
        <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-5 pb-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Valor del pipeline</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-heading text-[32px] font-bold tracking-tight tabular-nums leading-none sm:text-[36px]">
                {formatCompact(pipelineValue)}
              </p>
              {pipelineCashFlow > 0 && (
                <p className="text-sm text-muted-foreground">
                  CF potencial{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatCurrency(pipelineCashFlow)}
                  </span>
                  /mes
                </p>
              )}
            </div>
            <p className="mt-2.5 text-sm text-muted-foreground">
              <span className="font-medium tabular-nums text-foreground">
                {activeDeals.length}
              </span>{" "}
              activo{activeDeals.length === 1 ? "" : "s"}
              {closingDeals > 0 && (
                <>
                  <span className="mx-1.5 text-muted-foreground/40">·</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {closingDeals}
                  </span>{" "}
                  en cierre
                </>
              )}
              {avgRoi > 0 && (
                <>
                  <span className="mx-1.5 text-muted-foreground/40">·</span>
                  ROI medio{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {avgRoi.toFixed(1)}%
                  </span>
                </>
              )}
            </p>
          </div>
          <Link
            href="/deals"
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary outline-none transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            Ver deals
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {stageTotal > 0 && deals.length > 0 && (
          <div className="border-t border-border/60 px-5 py-3.5 sm:px-6">
            <div
              className="flex h-2 gap-0.5"
              role="img"
              aria-label="Distribución del pipeline por etapa"
            >
              {stageCounts.map((s) =>
                s.count > 0 ? (
                  <div
                    key={s.id}
                    className={cn(
                      "h-full min-w-1 rounded-full",
                      STAGE_BAR[s.id]
                    )}
                    style={{
                      width: `${(s.count / stageTotal) * 100}%`,
                    }}
                    title={`${s.label}: ${s.count}`}
                  />
                ) : null
              )}
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-1 gap-y-1.5 text-[13px]">
              {stageCounts.map((s, i) => (
                <span key={s.id} className="inline-flex items-center gap-1">
                  {i > 0 && (
                    <span
                      className="mx-1 text-muted-foreground/40"
                      aria-hidden
                    >
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
          </div>
        )}

        <div className="border-t border-border/60">
          {deals.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6">
              <p className="text-sm font-medium">Tu pipeline está vacío</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Añade un deal o analiza una propiedad en la calculadora.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => router.push("/deals")}
                >
                  <Plus className="size-3.5" />
                  Nuevo deal
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => router.push("/calculadora")}
                >
                  Abrir calculadora
                </Button>
              </div>
            </div>
          ) : (
            deals
              .filter((d) => d.id !== focusDeal?.id)
              .slice(0, 4)
              .map((deal) => (
                <Link
                  key={deal.id}
                  href="/deals"
                  className="group grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/50 px-5 py-3 last:border-b-0 transition-colors hover:bg-muted/35 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium tracking-tight">
                      {deal.address}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {deal.city}
                      <span className="mx-1.5 text-muted-foreground/40">·</span>
                      <span className="tabular-nums">
                        {formatCompact(deal.askingPrice)}
                      </span>
                    </p>
                  </div>
                  <p className="hidden shrink-0 text-right text-sm font-semibold tabular-nums sm:block">
                    {deal.cashFlow > 0 || deal.roi > 0 ? (
                      <>
                        {deal.cashFlow > 0 && (
                          <span>{formatCurrency(deal.cashFlow)}/mes</span>
                        )}
                        {deal.cashFlow > 0 && deal.roi > 0 && (
                          <span className="mx-1.5 font-normal text-muted-foreground/40">
                            ·
                          </span>
                        )}
                        {deal.roi > 0 && <span>{deal.roi}%</span>}
                      </>
                    ) : (
                      <span className="font-normal text-muted-foreground">
                        —
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 justify-self-end">
                    <StageChip stage={deal.stage} />
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                  </div>
                </Link>
              ))
          )}
        </div>
      </section>
    </div>
  )
}

function MetricTile({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="rounded-xl bg-muted/55 px-3.5 py-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-heading text-lg font-bold tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  )
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

function defaultNextStep(stage: DealStage, city: string): string {
  switch (stage) {
    case "prospecto":
      return `Corre los números de esta propiedad en ${city} antes de ofertar.`
    case "analisis":
      return "Compara con deals similares de la zona y decide si ofertar."
    case "oferta":
      return "Da seguimiento a la oferta y prepara prueba de fondos."
    case "negociacion":
      return "Ajusta precio o términos con comparables de la zona."
    case "due-diligence":
      return "Cierra inspección, título y financiamiento."
    default:
      return "Revisa el deal y define el siguiente movimiento."
  }
}
