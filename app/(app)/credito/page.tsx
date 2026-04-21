"use client"

import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Wallet,
  PiggyBank,
  ArrowRight,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  mockCreditCards,
  formatCurrency,
  formatPercent,
  getUtilizationColor,
  getUtilizationBg,
} from "@/lib/mock-data"

export default function CreditoPage() {
  const totalLimit = mockCreditCards.reduce((s, c) => s + c.creditLimit, 0)
  const totalBalance = mockCreditCards.reduce(
    (s, c) => s + c.currentBalance,
    0,
  )
  const totalAllocated = mockCreditCards.reduce((s, c) => s + c.allocated, 0)
  const totalAvailable = totalLimit - totalBalance
  const overallUtilization = (totalBalance / totalLimit) * 100
  const unallocatedCredit = totalAvailable - totalAllocated

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Crédito Total</p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Wallet className="size-4 text-blue-500" />
              </div>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold">
              {formatCurrency(totalLimit)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {mockCreditCards.length} tarjetas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Disponible</p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <DollarSign className="size-4 text-emerald-500" />
              </div>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalAvailable)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatPercent(100 - overallUtilization)} libre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Utilización</p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                <TrendingUp className="size-4 text-amber-500" />
              </div>
            </div>
            <p
              className={`mt-2 font-heading text-2xl font-bold ${getUtilizationColor(overallUtilization)}`}
            >
              {formatPercent(overallUtilization)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Recomendado: {"<"}30%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Asignado</p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Target className="size-4 text-primary" />
              </div>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold">
              {formatCurrency(totalAllocated)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatCurrency(unallocatedCredit)} sin asignar
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Credit Cards */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-base">
                    Tus Tarjetas
                  </CardTitle>
                  <CardDescription>
                    Utilización y asignación de cada tarjeta
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <CreditCard className="size-3.5" />
                  Añadir Tarjeta
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCreditCards.map((card) => {
                const utilization =
                  (card.currentBalance / card.creditLimit) * 100
                const available = card.creditLimit - card.currentBalance

                return (
                  <div
                    key={card.id}
                    className="rounded-lg border border-border/60 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <CreditCard className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {card.issuer} {card.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {card.rewards} · APR {card.apr}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-heading text-lg font-bold ${getUtilizationColor(utilization)}`}
                        >
                          {formatPercent(utilization)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          utilización
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatCurrency(card.currentBalance)} usado
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(card.creditLimit)} límite
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${getUtilizationBg(utilization)}`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">Disponible</p>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(available)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Asignado</p>
                        <p className="font-medium">
                          {card.allocated > 0
                            ? formatCurrency(card.allocated)
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pago mínimo</p>
                        <p className="font-medium">
                          {formatCurrency(card.minPayment)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Strategy Panel */}
        <div className="space-y-4">
          {/* Utilization Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">
                Salud Crediticia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCreditCards.map((card) => {
                const util = (card.currentBalance / card.creditLimit) * 100
                const isGood = util <= 30
                const isWarning = util > 30 && util <= 50

                return (
                  <div key={card.id} className="flex items-center gap-2">
                    {isGood ? (
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    ) : isWarning ? (
                      <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                    ) : (
                      <AlertTriangle className="size-4 shrink-0 text-red-500" />
                    )}
                    <span className="flex-1 truncate text-xs">
                      {card.issuer} {card.name}
                    </span>
                    <span
                      className={`text-xs font-medium ${getUtilizationColor(util)}`}
                    >
                      {formatPercent(util)}
                    </span>
                  </div>
                )
              })}

              <Separator />

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium">Recomendación</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {overallUtilization > 30
                    ? "Tu utilización general está por encima del 30%. Considera pagar el balance de las tarjetas con mayor utilización para mejorar tu score."
                    : "Tu utilización está en buen rango. Mantén cada tarjeta por debajo del 30% para optimizar tu score crediticio."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Allocation Strategy */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">
                Estrategia de Asignación
              </CardTitle>
              <CardDescription>
                Asigna crédito disponible a futuras adquisiciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <PiggyBank className="size-4 text-primary" />
                  <span className="text-xs font-medium">
                    Poder de compra estimado
                  </span>
                </div>
                <p className="mt-1 font-heading text-2xl font-bold text-primary">
                  {formatCurrency(totalAvailable * 5)}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Basado en {formatCurrency(totalAvailable)} disponible como
                  pronto (20%)
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-medium">Próximos pasos</p>
                {[
                  "Paga balance de Amex para liberar $13,400",
                  "Asigna Capital One Venture para próximo deal",
                  "Mantén Chase por debajo de 30% utilización",
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-[11px] text-muted-foreground"
                  >
                    <ArrowRight className="mt-0.5 size-3 shrink-0 text-primary" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Allocation Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-base">
            Resumen de Asignación
          </CardTitle>
          <CardDescription>
            Distribución de crédito entre tus tarjetas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarjeta</TableHead>
                <TableHead className="text-right">Límite</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Disponible</TableHead>
                <TableHead className="text-right">Asignado</TableHead>
                <TableHead className="text-right">Utilización</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreditCards.map((card) => {
                const util = (card.currentBalance / card.creditLimit) * 100
                const available = card.creditLimit - card.currentBalance

                return (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">
                      {card.issuer} {card.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(card.creditLimit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(card.currentBalance)}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(available)}
                    </TableCell>
                    <TableCell className="text-right">
                      {card.allocated > 0
                        ? formatCurrency(card.allocated)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${getUtilizationColor(util)}`}
                      >
                        {formatPercent(util)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalLimit)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalBalance)}
                </TableCell>
                <TableCell className="text-right text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalAvailable)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalAllocated)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${getUtilizationColor(overallUtilization)}`}
                  >
                    {formatPercent(overallUtilization)}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
