"use client"

import { useState } from "react"
import {
  Plus,
  X,
  Trophy,
  Bed,
  Bath,
  Ruler,
  Calendar,
  TrendingUp,
  DollarSign,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  mockProperties,
  formatCurrency,
  formatNumber,
  formatPercent,
  type Property,
} from "@/lib/mock-data"

function scoreProperty(property: Property): number {
  const priceScore = Math.max(0, 100 - property.pricePerSqFt / 5)
  const rentRatio =
    property.estimatedRent > 0
      ? (property.estimatedRent * 12) / property.price
      : 0
  const rentScore = rentRatio * 1000
  const daysScore = Math.max(0, 100 - property.daysOnMarket)
  const cashBonus = property.cashDeal ? 10 : 0

  return Math.round((priceScore + rentScore + daysScore + cashBonus) / 4)
}

export default function ComparadorPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "prop-001",
    "prop-003",
    "prop-005",
  ])

  const selected = selectedIds
    .map((id) => mockProperties.find((p) => p.id === id))
    .filter(Boolean) as Property[]

  const scores = selected.map((p) => ({ id: p.id, score: scoreProperty(p) }))
  const bestId =
    scores.length > 0
      ? scores.reduce((a, b) => (a.score > b.score ? a : b)).id
      : null

  function addProperty(id: string) {
    if (!selectedIds.includes(id) && selectedIds.length < 5) {
      setSelectedIds([...selectedIds, id])
    }
  }

  function removeProperty(id: string) {
    setSelectedIds(selectedIds.filter((i) => i !== id))
  }

  const availableToAdd = mockProperties.filter(
    (p) => !selectedIds.includes(p.id),
  )

  return (
    <div className="space-y-6">
      {/* Add Properties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-base">
            Selecciona Propiedades
          </CardTitle>
          <CardDescription>
            Compara hasta 5 propiedades lado a lado ({selected.length}/5
            seleccionadas)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {selected.map((p) => (
              <Badge
                key={p.id}
                variant="secondary"
                className="gap-1.5 py-1.5 pl-3 pr-1.5"
              >
                <span className="max-w-[150px] truncate text-xs">
                  {p.address}
                </span>
                <button
                  onClick={() => removeProperty(p.id)}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            {selectedIds.length < 5 && (
              <Select onValueChange={addProperty}>
                <SelectTrigger className="w-[220px]">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Plus className="size-3.5" />
                    <span>Añadir propiedad</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableToAdd.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.address} — {formatCurrency(p.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {selected.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20">
          <Building2 className="size-10 text-muted-foreground/30" />
          <p className="mt-4 text-sm font-medium">
            Selecciona propiedades para comparar
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Añade al menos 2 propiedades para ver la comparación
          </p>
        </div>
      ) : (
        <>
          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${selected.length}, minmax(220px, 1fr))`,
              }}
            >
              {selected.map((p) => {
                const score = scores.find((s) => s.id === p.id)?.score ?? 0
                const isBest = p.id === bestId && selected.length > 1

                return (
                  <Card
                    key={p.id}
                    className={
                      isBest
                        ? "border-primary shadow-md shadow-primary/10"
                        : ""
                    }
                  >
                    <CardHeader className="relative pb-3">
                      {isBest && (
                        <div className="absolute -top-2.5 right-3">
                          <Badge className="gap-1 shadow-sm">
                            <Trophy className="size-3" />
                            Mejor Deal
                          </Badge>
                        </div>
                      )}
                      <CardTitle className="font-heading text-sm leading-tight">
                        {p.address}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {p.city} · {p.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Score */}
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Score
                        </p>
                        <p
                          className={`font-heading text-3xl font-bold ${
                            isBest
                              ? "text-primary"
                              : score >= 60
                                ? "text-emerald-500"
                                : score >= 40
                                  ? "text-amber-500"
                                  : "text-red-500"
                          }`}
                        >
                          {score}
                        </p>
                      </div>

                      <Separator />

                      {/* Metrics */}
                      <div className="space-y-2.5">
                        <MetricRow
                          icon={DollarSign}
                          label="Precio"
                          value={formatCurrency(p.price)}
                          highlight={
                            p.price ===
                            Math.min(...selected.map((s) => s.price))
                          }
                        />
                        <MetricRow
                          icon={DollarSign}
                          label="Precio/p²"
                          value={formatCurrency(p.pricePerSqFt)}
                          highlight={
                            p.pricePerSqFt ===
                            Math.min(...selected.map((s) => s.pricePerSqFt))
                          }
                        />
                        <MetricRow
                          icon={TrendingUp}
                          label="Renta est."
                          value={formatCurrency(p.estimatedRent)}
                          highlight={
                            p.estimatedRent ===
                            Math.max(...selected.map((s) => s.estimatedRent))
                          }
                        />
                        <MetricRow
                          icon={TrendingUp}
                          label="Rent ratio"
                          value={formatPercent(
                            (p.estimatedRent * 12 / p.price) * 100,
                          )}
                          highlight={
                            p.estimatedRent / p.price ===
                            Math.max(
                              ...selected.map((s) => s.estimatedRent / s.price),
                            )
                          }
                        />

                        <Separator />

                        {p.bedrooms > 0 && (
                          <MetricRow
                            icon={Bed}
                            label="Habitaciones"
                            value={p.bedrooms.toString()}
                          />
                        )}
                        <MetricRow
                          icon={Bath}
                          label="Baños"
                          value={p.bathrooms.toString()}
                        />
                        <MetricRow
                          icon={Ruler}
                          label="Área"
                          value={`${formatNumber(p.sqFt)} p²`}
                          highlight={
                            p.sqFt ===
                            Math.max(...selected.map((s) => s.sqFt))
                          }
                        />
                        <MetricRow
                          icon={Calendar}
                          label="Vendida"
                          value={new Date(p.dateSold).toLocaleDateString(
                            "es-PR",
                            { month: "short", year: "numeric" },
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="flex flex-wrap gap-1.5">
                        {p.cashDeal && (
                          <Badge
                            variant="secondary"
                            className="text-[10px]"
                          >
                            Cash Deal
                          </Badge>
                        )}
                        {p.verified && (
                          <Badge
                            variant="secondary"
                            className="text-[10px]"
                          >
                            Verificado
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">
                          {p.daysOnMarket}d en mercado
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          {selected.length >= 2 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">
                  Resumen de la Comparación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryItem
                    label="Precio más bajo"
                    value={formatCurrency(
                      Math.min(...selected.map((p) => p.price)),
                    )}
                    detail={
                      selected.find(
                        (p) =>
                          p.price ===
                          Math.min(...selected.map((s) => s.price)),
                      )?.city ?? ""
                    }
                  />
                  <SummaryItem
                    label="Mejor precio/p²"
                    value={formatCurrency(
                      Math.min(...selected.map((p) => p.pricePerSqFt)),
                    )}
                    detail="por pie cuadrado"
                  />
                  <SummaryItem
                    label="Mayor renta est."
                    value={formatCurrency(
                      Math.max(...selected.map((p) => p.estimatedRent)),
                    )}
                    detail="mensual"
                  />
                  <SummaryItem
                    label="Precio promedio"
                    value={formatCurrency(
                      Math.round(
                        selected.reduce((a, b) => a + b.price, 0) /
                          selected.length,
                      ),
                    )}
                    detail={`de ${selected.length} propiedades`}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function MetricRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span
        className={`text-xs font-medium ${highlight ? "text-primary" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}

function SummaryItem({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-heading text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{detail}</p>
    </div>
  )
}
