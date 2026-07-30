"use client"

import * as React from "react"
import {
  BadgeCheck,
  Building,
  CircleDollarSign,
  Palmtree,
  Save,
  TrendingUp,
  X,
} from "lucide-react"
import { toast } from "sonner"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { formatCurrency, zoneById } from "@cancel/data"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  cn,
} from "@cancel/ui"

import {
  computeFlip,
  computeRental,
  computeStr,
  projection10Years,
} from "@/lib/finance"
import { useAnalysisStore, type CalcMode } from "@/lib/stores/analysis"
import { usePipelineStore } from "@/lib/stores/pipeline"

export default function CalculadoraPage() {
  const { prefill, clear } = useAnalysisStore()
  const addDeal = usePipelineStore((s) => s.addDeal)

  const [mode, setMode] = React.useState<CalcMode>(prefill?.mode ?? "alquiler")

  // --- inputs compra
  const [price, setPrice] = React.useState(prefill?.price ?? 185000)
  const [closingPct, setClosingPct] = React.useState(3)
  const [rehab, setRehab] = React.useState(prefill?.rehab ?? 12000)

  // --- financiamiento
  const [financed, setFinanced] = React.useState(false)
  const [downPct, setDownPct] = React.useState(25)
  const [ratePct, setRatePct] = React.useState(7.2)
  const [years, setYears] = React.useState(30)

  // --- ingresos LTR
  const [rent, setRent] = React.useState(prefill?.rent ?? 1600)
  const [taxesAnnual, setTaxesAnnual] = React.useState(1400)
  const [insuranceAnnual, setInsuranceAnnual] = React.useState(1200)
  const [hoaMonthly, setHoaMonthly] = React.useState(0)
  const [maintenancePct, setMaintenancePct] = React.useState(5)
  const [vacancyPct, setVacancyPct] = React.useState(5)
  const [mgmtPct, setMgmtPct] = React.useState(0)

  // --- flip
  const [arv, setArv] = React.useState(
    prefill?.sqft && prefill.zone
      ? prefill.sqft * (zoneById(prefill.zone)?.medianPpsf ?? 150)
      : 260000
  )
  const [holdingMonths, setHoldingMonths] = React.useState(5)
  const [holdingMonthly, setHoldingMonthly] = React.useState(350)
  const [sellingPct, setSellingPct] = React.useState(6)

  // --- STR
  const [adr, setAdr] = React.useState(
    prefill?.strNightly ??
      (prefill?.zone ? (zoneById(prefill.zone)?.strAdr ?? 150) : 150)
  )
  const [occupancyPct, setOccupancyPct] = React.useState(
    Math.round(
      ((prefill?.zone ? zoneById(prefill.zone)?.strOccupancy : undefined) ??
        0.7) * 100
    )
  )
  const [mgmtStrPct, setMgmtStrPct] = React.useState(20)
  const [utilitiesMonthly, setUtilitiesMonthly] = React.useState(280)

  const rental = computeRental({
    price,
    closingPct,
    rehab,
    financed,
    downPct,
    ratePct,
    years,
    monthlyRent: rent,
    taxesAnnual,
    insuranceAnnual,
    hoaMonthly,
    maintenancePct,
    vacancyPct,
    mgmtPct,
  })

  const flip = computeFlip({
    price,
    rehab,
    closingBuyPct: closingPct,
    holdingMonths,
    holdingMonthly,
    sellingPct,
    arv,
  })

  const str = computeStr({
    adr,
    occupancyPct,
    cleaningPerStay: 85,
    avgStayNights: 4,
    platformPct: 3,
    mgmtPct: mgmtStrPct,
    utilitiesMonthly,
  })

  const projection = projection10Years(rental, {
    price,
    closingPct,
    rehab,
    financed,
    downPct,
    ratePct,
    years,
    monthlyRent: rent,
    taxesAnnual,
    insuranceAnnual,
    hoaMonthly,
    maintenancePct,
    vacancyPct,
    mgmtPct,
  })

  const saveAnalysis = () => {
    const isFlip = mode === "flip"
    const cf = mode === "airbnb" ? str.netMonthly - rental.expensesMonthly : isFlip ? 0 : rental.cashFlowMonthly
    addDeal({
      address: prefill?.address ?? `Análisis ${mode} — ${formatCurrency(price)}`,
      city: prefill?.zone
        ? `${zoneById(prefill.zone)?.name}, ${zoneById(prefill.zone)?.city}`
        : "Puerto Rico",
      stage: "analisis",
      askingPrice: price,
      offerPrice: null,
      roi: Math.round((isFlip ? flip.roi : rental.cashOnCash) * 10) / 10,
      cashFlow: Math.round(cf),
      notes: `Análisis guardado desde la calculadora (${mode}). Cap rate ${rental.capRate.toFixed(1)}%. Cash necesario: ${formatCurrency(rental.cashNeeded)}.`,
      contactName: "",
      contactRole: "",
    })
    toast.success("Análisis guardado en tu pipeline (etapa: Análisis)")
  }

  const verdict = getVerdict(mode, rental.cashOnCash, flip.roi)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Banner de prefill */}
      {prefill?.address && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2.5 text-sm">
            <BadgeCheck className="size-4 shrink-0 text-primary" />
            <span className="truncate">
              Analizando: <strong>{prefill.address}</strong>
              {prefill.zone && zoneById(prefill.zone) && (
                <span className="text-muted-foreground">
                  {" "}
                  · {zoneById(prefill.zone)!.name}
                </span>
              )}
            </span>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={clear} aria-label="Limpiar">
            <X className="size-4" />
          </Button>
        </div>
      )}

      <Tabs value={mode} onValueChange={(v) => setMode(v as CalcMode)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="alquiler" className="flex-1 sm:flex-none">
            <Building className="size-4" />
            Alquiler
          </TabsTrigger>
          <TabsTrigger value="flip" className="flex-1 sm:flex-none">
            <TrendingUp className="size-4" />
            Flip
          </TabsTrigger>
          <TabsTrigger value="airbnb" className="flex-1 sm:flex-none">
            <Palmtree className="size-4" />
            Airbnb
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* ------------------------------ INPUTS ------------------------------ */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Compra</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <NumberField label="Precio de compra" value={price} onChange={setPrice} prefix="$" step={5000} />
              <NumberField label="Costos de cierre" value={closingPct} onChange={setClosingPct} suffix="%" step={0.5} />
              <NumberField
                label={mode === "flip" ? "Remodelación" : "Reparos iniciales"}
                value={rehab}
                onChange={setRehab}
                prefix="$"
                step={1000}
                className="col-span-2"
              />
            </CardContent>
          </Card>

          {mode !== "flip" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm">Financiamiento</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {financed ? "Hipoteca" : "Cash / crédito"}
                  <Switch checked={financed} onCheckedChange={setFinanced} />
                </div>
              </CardHeader>
              {financed && (
                <CardContent className="grid grid-cols-3 gap-3">
                  <NumberField label="Pronto" value={downPct} onChange={setDownPct} suffix="%" step={5} />
                  <NumberField label="Tasa" value={ratePct} onChange={setRatePct} suffix="%" step={0.1} />
                  <NumberField label="Años" value={years} onChange={setYears} step={5} />
                </CardContent>
              )}
            </Card>
          )}

          {mode === "alquiler" && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Ingresos</CardTitle>
                </CardHeader>
                <CardContent>
                  <NumberField label="Renta mensual estimada" value={rent} onChange={setRent} prefix="$" step={50} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Gastos</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <NumberField label="CRIM (año)" value={taxesAnnual} onChange={setTaxesAnnual} prefix="$" step={100} />
                  <NumberField label="Seguro (año)" value={insuranceAnnual} onChange={setInsuranceAnnual} prefix="$" step={100} />
                  <NumberField label="HOA (mes)" value={hoaMonthly} onChange={setHoaMonthly} prefix="$" step={25} />
                  <NumberField label="Administración" value={mgmtPct} onChange={setMgmtPct} suffix="%" step={1} />
                  <NumberField label="Mantenimiento" value={maintenancePct} onChange={setMaintenancePct} suffix="%" step={1} />
                  <NumberField label="Vacancia" value={vacancyPct} onChange={setVacancyPct} suffix="%" step={1} />
                </CardContent>
              </Card>
            </>
          )}

          {mode === "flip" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Venta (ARV)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <NumberField label="Valor después de remodelar" value={arv} onChange={setArv} prefix="$" step={5000} className="col-span-2" />
                <NumberField label="Meses de trabajo" value={holdingMonths} onChange={setHoldingMonths} step={1} />
                <NumberField label="Costo mensual holding" value={holdingMonthly} onChange={setHoldingMonthly} prefix="$" step={50} />
                <NumberField label="Costos de venta" value={sellingPct} onChange={setSellingPct} suffix="%" step={0.5} />
              </CardContent>
            </Card>
          )}

          {mode === "airbnb" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Short-term rental</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <NumberField label="Tarifa por noche (ADR)" value={adr} onChange={setAdr} prefix="$" step={10} />
                <NumberField label="Ocupación" value={occupancyPct} onChange={setOccupancyPct} suffix="%" step={5} />
                <NumberField label="Management" value={mgmtStrPct} onChange={setMgmtStrPct} suffix="%" step={5} />
                <NumberField label="Utilidades (mes)" value={utilitiesMonthly} onChange={setUtilitiesMonthly} prefix="$" step={20} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* ------------------------------ RESULTADOS ------------------------------ */}
        <div className="space-y-4 lg:col-span-3">
          {/* Número principal */}
          <Card
            className={cn(
              "border-2",
              verdict.tone === "great" && "border-primary/40 bg-gradient-to-br from-primary/8 to-transparent",
              verdict.tone === "ok" && "border-amber-500/30",
              verdict.tone === "bad" && "border-destructive/30"
            )}
          >
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {mode === "flip" ? "Ganancia neta estimada" : "Cash flow mensual"}
                </p>
                <p
                  className={cn(
                    "font-heading text-4xl font-extrabold tracking-tight",
                    (mode === "flip" ? flip.netProfit : rental.cashFlowMonthly) < 0 &&
                      "text-destructive"
                  )}
                >
                  {mode === "flip"
                    ? formatCurrency(flip.netProfit)
                    : formatCurrency(
                        mode === "airbnb"
                          ? Math.round(str.netMonthly - rental.expensesMonthly)
                          : rental.cashFlowMonthly
                      )}
                  {mode !== "flip" && (
                    <span className="text-base font-medium text-muted-foreground">
                      /mes
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {verdict.label}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                {mode === "flip" ? (
                  <>
                    <BigMetric label="ROI del deal" value={`${flip.roi.toFixed(1)}%`} />
                    <BigMetric label="ROI anualizado" value={`${flip.annualizedRoi.toFixed(0)}%`} />
                    <BigMetric label="Inversión total" value={formatCurrency(flip.totalInvestment)} />
                    <BigMetric label="Venta break-even" value={formatCurrency(Math.round(flip.breakEvenSale))} />
                  </>
                ) : (
                  <>
                    <BigMetric label="Cap rate" value={`${rental.capRate.toFixed(1)}%`} />
                    <BigMetric label="Cash-on-cash" value={`${rental.cashOnCash.toFixed(1)}%`} />
                    <BigMetric label="Cash necesario" value={formatCurrency(rental.cashNeeded)} />
                    <BigMetric
                      label="Break-even"
                      value={
                        rental.breakEvenMonths
                          ? `${Math.floor(rental.breakEvenMonths / 12)}a ${rental.breakEvenMonths % 12}m`
                          : "—"
                      }
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Desglose mensual */}
          {mode !== "flip" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Desglose mensual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {mode === "airbnb" ? (
                  <>
                    <Row label={`Ingreso bruto STR (${str.nightsBooked} noches)`} value={formatCurrency(Math.round(str.grossMonthly))} />
                    <Row label="Plataforma + management + utilidades" value={`− ${formatCurrency(Math.round(str.expensesMonthly))}`} muted />
                    <Row label="Gastos de propiedad (CRIM, seguro, mant.)" value={`− ${formatCurrency(Math.round(rental.expensesMonthly))}`} muted />
                    <Separator />
                    <Row label="Neto mensual STR" value={formatCurrency(Math.round(str.netMonthly - rental.expensesMonthly))} strong />
                    <Row
                      label="vs. alquiler a largo plazo"
                      value={formatCurrency(Math.round(rental.noiMonthly - rental.mortgageMonthly))}
                      muted
                    />
                  </>
                ) : (
                  <>
                    <Row label="Ingreso bruto (renta)" value={formatCurrency(rental.grossMonthly)} />
                    <Row label="Vacancia + mantenimiento + mgmt" value={`− ${formatCurrency(Math.round((rent * (vacancyPct + maintenancePct + mgmtPct)) / 100))}`} muted />
                    <Row label="CRIM + seguro + HOA" value={`− ${formatCurrency(Math.round(taxesAnnual / 12 + insuranceAnnual / 12 + hoaMonthly))}`} muted />
                    {financed && (
                      <Row label="Hipoteca (P&I)" value={`− ${formatCurrency(Math.round(rental.mortgageMonthly))}`} muted />
                    )}
                    <Separator />
                    <Row label="Cash flow mensual" value={formatCurrency(rental.cashFlowMonthly)} strong />
                    {rental.dscr && (
                      <Row
                        label="DSCR (cobertura de deuda)"
                        value={rental.dscr.toFixed(2)}
                        muted
                      />
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {mode === "flip" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Desglose del deal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Compra + cierre" value={formatCurrency(Math.round(price * (1 + closingPct / 100)))} />
                <Row label="Remodelación" value={formatCurrency(rehab)} />
                <Row label={`Holding (${holdingMonths} meses)`} value={formatCurrency(holdingMonths * holdingMonthly)} />
                <Row label={`Costos de venta (${sellingPct}%)`} value={formatCurrency(Math.round(flip.sellingCosts))} />
                <Separator />
                <Row label="Venta estimada (ARV)" value={formatCurrency(arv)} strong />
                <Row label="Margen sobre ARV" value={`${flip.marginOnArv.toFixed(1)}%`} muted />
              </CardContent>
            </Card>
          )}

          {/* Proyección */}
          {mode !== "flip" && (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-sm">
                  Proyección a 10 años
                  <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                    3% apreciación · 2% aumento de renta
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-56 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projection} margin={{ top: 16, right: 16, bottom: 0, left: 8 }}>
                    <defs>
                      <linearGradient id="grad-valor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="grad-cf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `$${Math.round(v / 1000)}K`}
                      width={52}
                    />
                    <ChartTooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "valor" ? "Valor estimado" : "Cash flow acumulado",
                      ]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="valor" stroke="var(--primary)" strokeWidth={2} fill="url(#grad-valor)" />
                    <Area type="monotone" dataKey="acumulado" stroke="#3b82f6" strokeWidth={2} fill="url(#grad-cf)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Button className="w-full" size="lg" onClick={saveAnalysis}>
            <Save className="size-4" />
            Guardar análisis en mi pipeline
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            <CircleDollarSign className="mr-1 inline size-3" />
            Estimados con fines educativos — verifica siempre con tu propio análisis.
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  className,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  step?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-[11px] font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={cn("h-10 rounded-lg", prefix && "pl-7", suffix && "pr-8")}
        />
        {suffix && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function BigMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="font-heading text-lg font-bold tracking-tight">{value}</p>
    </div>
  )
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string
  value: string
  muted?: boolean
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : strong ? "font-semibold" : ""}>
        {label}
      </span>
      <span className={strong ? "font-heading font-bold" : muted ? "text-muted-foreground" : "font-medium"}>
        {value}
      </span>
    </div>
  )
}

function getVerdict(mode: CalcMode, coc: number, flipRoi: number) {
  if (mode === "flip") {
    if (flipRoi >= 20) return { tone: "great" as const, label: "🔥 Deal brutal — margen saludable para un flip" }
    if (flipRoi >= 12) return { tone: "ok" as const, label: "Deal decente — aprieta la compra o la remodelación" }
    return { tone: "bad" as const, label: "Margen flojo — negocia el precio o pasa al siguiente" }
  }
  if (coc >= 10) return { tone: "great" as const, label: "🔥 Cash-on-cash brutal para PR — este deal merece un segundo vistazo" }
  if (coc >= 6) return { tone: "ok" as const, label: "Retorno decente — compara con otros deals de la zona" }
  return { tone: "bad" as const, label: "Retorno bajo — ajusta precio, renta o gastos" }
}
