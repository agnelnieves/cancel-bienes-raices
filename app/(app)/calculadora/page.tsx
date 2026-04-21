"use client"

import { useState, useMemo } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Clock,
  Info,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency, formatPercent } from "@/lib/mock-data"

function useNumberInput(initial: number) {
  const [value, setValue] = useState(initial)
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const n = parseFloat(e.target.value)
      setValue(isNaN(n) ? 0 : n)
    },
  }
}

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="size-3.5 text-muted-foreground/50" />
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[200px] text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

export default function CalculadoraPage() {
  const purchasePrice = useNumberInput(185000)
  const downPaymentPct = useNumberInput(20)
  const interestRate = useNumberInput(7.5)
  const loanTermYears = useNumberInput(30)
  const closingCosts = useNumberInput(5000)
  const repairCosts = useNumberInput(10000)

  const monthlyRent = useNumberInput(1800)
  const otherIncome = useNumberInput(0)

  const propertyTax = useNumberInput(150)
  const insurance = useNumberInput(100)
  const maintenance = useNumberInput(90)
  const vacancy = useNumberInput(8)
  const management = useNumberInput(0)
  const hoa = useNumberInput(0)

  const results = useMemo(() => {
    const price = purchasePrice.value
    const downPmt = price * (downPaymentPct.value / 100)
    const loanAmount = price - downPmt
    const monthlyRate = interestRate.value / 100 / 12
    const numPayments = loanTermYears.value * 12

    // Monthly mortgage payment (P&I)
    let monthlyMortgage = 0
    if (monthlyRate > 0 && numPayments > 0) {
      monthlyMortgage =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
    }

    // Gross monthly income
    const grossMonthly = monthlyRent.value + otherIncome.value

    // Vacancy loss
    const vacancyLoss = grossMonthly * (vacancy.value / 100)

    // Effective gross income
    const effectiveIncome = grossMonthly - vacancyLoss

    // Monthly expenses (excluding mortgage)
    const monthlyExpenses =
      propertyTax.value +
      insurance.value +
      maintenance.value +
      management.value +
      hoa.value

    // NOI (Net Operating Income) - annual
    const annualNOI = (effectiveIncome - monthlyExpenses) * 12

    // Cash flow
    const monthlyCashFlow = effectiveIncome - monthlyExpenses - monthlyMortgage
    const annualCashFlow = monthlyCashFlow * 12

    // Total cash invested
    const totalCashInvested =
      downPmt + closingCosts.value + repairCosts.value

    // Cap Rate
    const capRate = price > 0 ? (annualNOI / price) * 100 : 0

    // Cash-on-Cash ROI
    const cashOnCash =
      totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0

    // Break-even (months)
    const breakEven =
      monthlyCashFlow > 0
        ? Math.ceil(totalCashInvested / monthlyCashFlow)
        : Infinity

    // GRM (Gross Rent Multiplier)
    const grm = grossMonthly > 0 ? price / (grossMonthly * 12) : 0

    return {
      downPmt,
      loanAmount,
      monthlyMortgage,
      grossMonthly,
      effectiveIncome,
      monthlyExpenses,
      annualNOI,
      monthlyCashFlow,
      annualCashFlow,
      totalCashInvested,
      capRate,
      cashOnCash,
      breakEven,
      grm,
    }
  }, [
    purchasePrice.value,
    downPaymentPct.value,
    interestRate.value,
    loanTermYears.value,
    closingCosts.value,
    repairCosts.value,
    monthlyRent.value,
    otherIncome.value,
    propertyTax.value,
    insurance.value,
    maintenance.value,
    vacancy.value,
    management.value,
    hoa.value,
  ])

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <div className="space-y-4 lg:col-span-3">
        {/* Purchase */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">
              Datos de Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
                Precio de compra
                <InfoTip text="El precio de adquisición de la propiedad" />
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={purchasePrice.value || ""}
                  onChange={purchasePrice.onChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
                Pronto (%)
                <InfoTip text="Porcentaje del precio como pago inicial" />
              </Label>
              <div className="relative">
                <Percent className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={downPaymentPct.value || ""}
                  onChange={downPaymentPct.onChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Interés anual (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={interestRate.value || ""}
                onChange={interestRate.onChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Plazo (años)</Label>
              <Input
                type="number"
                value={loanTermYears.value || ""}
                onChange={loanTermYears.onChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Costos de cierre</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={closingCosts.value || ""}
                  onChange={closingCosts.onChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reparaciones</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={repairCosts.value || ""}
                  onChange={repairCosts.onChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">
              Ingresos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Renta mensual</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={monthlyRent.value || ""}
                  onChange={monthlyRent.onChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Otros ingresos</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={otherIncome.value || ""}
                  onChange={otherIncome.onChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">
              Gastos Mensuales
            </CardTitle>
            <CardDescription>
              No incluyas la hipoteca — se calcula automáticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">CRIM / Contribuciones</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={propertyTax.value || ""}
                  onChange={propertyTax.onChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Seguro</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={insurance.value || ""}
                  onChange={insurance.onChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mantenimiento</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={maintenance.value || ""}
                  onChange={maintenance.onChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
                Vacancia (%)
                <InfoTip text="Porcentaje estimado del tiempo sin inquilino" />
              </Label>
              <Input
                type="number"
                value={vacancy.value || ""}
                onChange={vacancy.onChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Property management</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={management.value || ""}
                  onChange={management.onChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">HOA / Mantenimiento</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-8"
                  value={hoa.value || ""}
                  onChange={hoa.onChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="space-y-4 lg:col-span-2">
        <div className="lg:sticky lg:top-4">
          {/* Key Metrics */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">
                Análisis de Inversión
              </CardTitle>
              <CardDescription>Resultados en tiempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Primary Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <MetricBox
                  label="Cap Rate"
                  value={formatPercent(results.capRate)}
                  quality={
                    results.capRate >= 8
                      ? "good"
                      : results.capRate >= 5
                        ? "ok"
                        : "bad"
                  }
                  tooltip="Ingreso operativo neto / precio de compra"
                />
                <MetricBox
                  label="Cash-on-Cash"
                  value={formatPercent(results.cashOnCash)}
                  quality={
                    results.cashOnCash >= 10
                      ? "good"
                      : results.cashOnCash >= 5
                        ? "ok"
                        : "bad"
                  }
                  tooltip="Flujo de caja anual / inversión total en efectivo"
                />
                <MetricBox
                  label="Cash Flow/mes"
                  value={formatCurrency(Math.round(results.monthlyCashFlow))}
                  quality={
                    results.monthlyCashFlow >= 300
                      ? "good"
                      : results.monthlyCashFlow >= 0
                        ? "ok"
                        : "bad"
                  }
                />
                <MetricBox
                  label="Break-even"
                  value={
                    results.breakEven === Infinity
                      ? "N/A"
                      : `${results.breakEven} meses`
                  }
                  quality={
                    results.breakEven <= 60
                      ? "good"
                      : results.breakEven <= 120
                        ? "ok"
                        : "bad"
                  }
                />
              </div>

              <Separator />

              {/* Deal Quality Indicator */}
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  {results.cashOnCash >= 10 ? (
                    <TrendingUp className="size-4 text-emerald-500" />
                  ) : results.cashOnCash >= 5 ? (
                    <TrendingUp className="size-4 text-amber-500" />
                  ) : (
                    <TrendingDown className="size-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {results.cashOnCash >= 10
                      ? "Buen deal"
                      : results.cashOnCash >= 5
                        ? "Deal aceptable"
                        : "Revisa los números"}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {results.cashOnCash >= 10
                    ? "Los números se ven bien. Cap rate y cash flow positivos."
                    : results.cashOnCash >= 5
                      ? "Los retornos son moderados. Evalúa si hay espacio para mejorar la renta."
                      : "El cash flow es bajo o negativo. Revisa el precio o los gastos."}
                </p>
              </div>

              <Separator />

              {/* Detailed Breakdown */}
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Desglose Financiero</h4>
                <Row
                  label="Pronto"
                  value={formatCurrency(results.downPmt)}
                />
                <Row
                  label="Préstamo"
                  value={formatCurrency(Math.round(results.loanAmount))}
                />
                <Row
                  label="Hipoteca mensual"
                  value={formatCurrency(Math.round(results.monthlyMortgage))}
                />
                <Separator />
                <Row
                  label="Ingreso bruto"
                  value={formatCurrency(results.grossMonthly)}
                  className="text-emerald-600 dark:text-emerald-400"
                />
                <Row
                  label="Ingreso efectivo"
                  value={formatCurrency(
                    Math.round(results.effectiveIncome),
                  )}
                />
                <Row
                  label="Gastos operativos"
                  value={`-${formatCurrency(results.monthlyExpenses)}`}
                  className="text-red-500"
                />
                <Row
                  label="Hipoteca"
                  value={`-${formatCurrency(Math.round(results.monthlyMortgage))}`}
                  className="text-red-500"
                />
                <Separator />
                <Row
                  label="NOI anual"
                  value={formatCurrency(Math.round(results.annualNOI))}
                  bold
                />
                <Row
                  label="Cash flow anual"
                  value={formatCurrency(Math.round(results.annualCashFlow))}
                  bold
                  className={
                    results.annualCashFlow >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500"
                  }
                />
                <Row
                  label="Total invertido"
                  value={formatCurrency(results.totalCashInvested)}
                  bold
                />
                <Row label="GRM" value={results.grm.toFixed(1)} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricBox({
  label,
  value,
  quality,
  tooltip,
}: {
  label: string
  value: string
  quality: "good" | "ok" | "bad"
  tooltip?: string
}) {
  const colors = {
    good: "border-emerald-500/20 bg-emerald-500/5",
    ok: "border-amber-500/20 bg-amber-500/5",
    bad: "border-red-500/20 bg-red-500/5",
  }

  const textColors = {
    good: "text-emerald-600 dark:text-emerald-400",
    ok: "text-amber-600 dark:text-amber-400",
    bad: "text-red-600 dark:text-red-400",
  }

  return (
    <div className={`rounded-lg border p-3 ${colors[quality]}`}>
      <div className="flex items-center gap-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        {tooltip && <InfoTip text={tooltip} />}
      </div>
      <p className={`mt-0.5 font-heading text-xl font-bold ${textColors[quality]}`}>
        {value}
      </p>
    </div>
  )
}

function Row({
  label,
  value,
  bold,
  className,
}: {
  label: string
  value: string
  bold?: boolean
  className?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-xs ${bold ? "font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      <span
        className={`text-xs ${bold ? "font-semibold" : ""} ${className ?? ""}`}
      >
        {value}
      </span>
    </div>
  )
}
