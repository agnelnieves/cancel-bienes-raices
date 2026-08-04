"use client"

import * as React from "react"
import {
  ArrowRight,
  BadgeCheck,
  Building,
  CircleDollarSign,
  Lightbulb,
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
import { InfoTip } from "@/components/info-tip"
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

  // Sensibilidad educativa: cuánto mejora el cash flow si bajas el precio $10K
  const sensitivity = React.useMemo(() => {
    if (mode === "flip") return null
    const cheaper = computeRental({
      price: Math.max(price - 10000, 1000),
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
    return Math.round(cheaper.cashFlowMonthly - rental.cashFlowMonthly)
  }, [
    mode, price, closingPct, rehab, financed, downPct, ratePct, years, rent,
    taxesAnnual, insuranceAnnual, hoaMonthly, maintenancePct, vacancyPct, mgmtPct,
    rental.cashFlowMonthly,
  ])

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
                <CardTitle className="flex items-center gap-1.5 text-sm">
                  Venta (ARV)
                  <InfoTip text="After Repair Value — cuánto valdrá la propiedad después de remodelarla." />
                </CardTitle>
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
                <NumberField label="Tarifa por noche (ADR)" tip="Average Daily Rate — el precio promedio que cobras por noche en Airbnb." value={adr} onChange={setAdr} prefix="$" step={10} />
                <NumberField label="Ocupación" value={occupancyPct} onChange={setOccupancyPct} suffix="%" step={5} />
                <NumberField label="Management" value={mgmtStrPct} onChange={setMgmtStrPct} suffix="%" step={5} />
                <NumberField label="Utilidades (mes)" value={utilitiesMonthly} onChange={setUtilitiesMonthly} prefix="$" step={20} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* ------------------------------ RESULTADOS ------------------------------ */}
        <div className="space-y-4 lg:col-span-3">
          {/* Veredicto en lenguaje sencillo — lo primero que ve el usuario */}
          <Card
            className={cn(
              "border-2",
              verdict.tone === "great" && "border-success/40 bg-gradient-to-br from-success/10 to-transparent",
              verdict.tone === "ok" && "border-warning/40 bg-gradient-to-br from-warning/8 to-transparent",
              verdict.tone === "bad" && "border-destructive/30 bg-gradient-to-br from-destructive/6 to-transparent"
            )}
          >
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide",
                      verdict.tone === "great" && "bg-success-soft text-success",
                      verdict.tone === "ok" && "bg-warning-soft text-warning",
                      verdict.tone === "bad" && "bg-destructive/10 text-destructive"
                    )}
                  >
                    {verdict.tone === "great" && <TrendingUp className="size-3.5" />}
                    {verdict.word}
                  </span>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {verdict.why}
                  </p>
                  <p className="mt-2 flex items-start gap-1.5 text-sm font-medium">
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <span className="text-muted-foreground">Próximo paso: </span>
                      {verdict.next}
                    </span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
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
                </div>
              </div>

              {/* Callout educativo — enseña la sensibilidad del deal (Zillow) */}
              {sensitivity !== null && sensitivity > 0 && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-info/25 bg-info-soft/70 px-3.5 py-2.5">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
                  <p className="text-[12.5px] leading-snug text-foreground/85">
                    Si bajas el precio <strong>$10,000</strong>, tu cash flow sube{" "}
                    <strong className="text-info">
                      ~{formatCurrency(sensitivity)}/mes
                    </strong>
                    . Negociar el precio es la palanca más poderosa que tienes.
                  </p>
                </div>
              )}

              {/* Detalle para el que quiere los números */}
              <details className="group mt-4 border-t border-border pt-3">
                <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[12px] font-medium text-muted-foreground outline-none transition-colors select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden">
                  <ArrowRight className="size-3.5 transition-transform group-open:rotate-90" />
                  Ver los números
                </summary>
                <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                  {mode === "flip" ? (
                    <>
                      <BigMetric label="ROI del deal" value={`${flip.roi.toFixed(1)}%`} />
                      <BigMetric label="ROI anualizado" value={`${flip.annualizedRoi.toFixed(0)}%`} />
                      <BigMetric label="Inversión total" value={formatCurrency(flip.totalInvestment)} />
                      <BigMetric label="Venta break-even" value={formatCurrency(Math.round(flip.breakEvenSale))} />
                    </>
                  ) : (
                    <>
                      <BigMetric label="Cap rate" tip="Cuánto rinde la propiedad al año si la pagaras toda en cash, como % de su valor." value={`${rental.capRate.toFixed(1)}%`} />
                      <BigMetric label="Cash-on-cash" tip="El retorno anual sobre el cash que tú sacaste de tu bolsillo (no sobre el precio total)." value={`${rental.cashOnCash.toFixed(1)}%`} />
                      <BigMetric label="Cash necesario" tip="Todo el dinero que necesitas para cerrar: pronto, costos y reparos." value={formatCurrency(rental.cashNeeded)} />
                      <BigMetric
                        label="Break-even"
                        tip="Cuánto tarda el cash flow acumulado en devolverte lo que invertiste."
                        value={
                          rental.breakEvenMonths
                            ? `${Math.floor(rental.breakEvenMonths / 12)}a ${rental.breakEvenMonths % 12}m`
                            : "—"
                        }
                      />
                    </>
                  )}
                </div>
              </details>
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
                        tip="Cuántas veces la renta cubre el pago de la hipoteca. Sobre 1.25 al banco le gusta."
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
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
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
  tip,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  step?: number
  className?: string
  tip?: string
}) {
  const id = React.useId()
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={id}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground"
      >
        {label}
        {tip && <InfoTip text={tip} />}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
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

function BigMetric({
  label,
  value,
  tip,
}: {
  label: string
  value: string
  tip?: string
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
        {tip && <InfoTip text={tip} />}
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
  tip,
}: {
  label: string
  value: string
  muted?: boolean
  strong?: boolean
  tip?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={cn(
          "flex min-w-0 items-center gap-1",
          muted ? "text-muted-foreground" : strong ? "font-semibold" : ""
        )}
      >
        {label}
        {tip && <InfoTip text={tip} />}
      </span>
      <span
        className={cn(
          "shrink-0 text-right tabular-nums",
          strong ? "font-heading font-bold" : muted ? "text-muted-foreground" : "font-medium"
        )}
      >
        {value}
      </span>
    </div>
  )
}

interface Verdict {
  tone: "great" | "ok" | "bad"
  /** Veredicto en palabras sencillas para alguien que no es técnico */
  word: string
  /** Una frase que explica el porqué */
  why: string
  /** La acción siguiente sugerida */
  next: string
}

function getVerdict(mode: CalcMode, coc: number, flipRoi: number): Verdict {
  if (mode === "flip") {
    if (flipRoi >= 20)
      return {
        tone: "great",
        word: "Sí tiene sentido",
        why: "El margen es saludable para un flip en PR — hay espacio para imprevistos.",
        next: "Coordina una visita y valida el costo de la remodelación con un contratista.",
      }
    if (flipRoi >= 12)
      return {
        tone: "ok",
        word: "Analízala bien",
        why: "El margen es justo — un imprevisto en la remodelación te lo puede comer.",
        next: "Aprieta el precio de compra o baja el presupuesto de remodelación.",
      }
    return {
      tone: "bad",
      word: "Déjala pasar",
      why: "El margen es muy fino para el riesgo y el trabajo de un flip.",
      next: "Negocia un precio mucho menor o busca otra propiedad.",
    }
  }
  if (coc >= 10)
    return {
      tone: "great",
      word: "Sí tiene sentido",
      why: "El retorno sobre tu cash es fuerte para el mercado de PR.",
      next: "Coordina una visita y confirma la renta con los comparables de la zona.",
    }
  if (coc >= 6)
    return {
      tone: "ok",
      word: "Analízala bien",
      why: "El retorno es decente, pero no deja mucho colchón.",
      next: "Compara con otros deals de la zona y ajusta precio o renta.",
    }
  return {
    tone: "bad",
    word: "Déjala pasar",
    why: "El retorno es bajo para lo que cuesta mover el dinero.",
    next: "Ajusta el precio, sube la renta o baja los gastos — o busca otra.",
  }
}
