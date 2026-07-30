"use client"

import * as React from "react"
import {
  AlertTriangle,
  BadgePercent,
  CreditCard as CardIcon,
  Landmark,
  Pencil,
  Play,
  Plus,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { formatCurrency, type CreditCard } from "@cancel/data"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Progress,
  Separator,
  cn,
} from "@cancel/ui"

import { useCreditStore } from "@/lib/stores/credit"

const MAX_UTIL = 30 // % máximo saludable por tarjeta

const utilOf = (c: CreditCard) =>
  Math.round(((c.currentBalance + c.allocated) / c.creditLimit) * 100)

const utilColor = (u: number) =>
  u <= 30 ? "text-primary" : u <= 50 ? "text-amber-500" : "text-destructive"

export default function CreditoPage() {
  const { cards, applyPlan, updateCard } = useCreditStore()
  const [target, setTarget] = React.useState(40000)
  const [planned, setPlanned] = React.useState<Record<string, number> | null>(null)
  const [editId, setEditId] = React.useState<string | null>(null)

  const totals = React.useMemo(() => {
    const limit = cards.reduce((a, c) => a + c.creditLimit, 0)
    const balance = cards.reduce((a, c) => a + c.currentBalance, 0)
    const allocated = cards.reduce((a, c) => a + c.allocated, 0)
    return {
      limit,
      balance,
      allocated,
      used: balance + allocated,
      util: limit > 0 ? Math.round(((balance + allocated) / limit) * 100) : 0,
      available: limit - balance - allocated,
    }
  }, [cards])

  // ---- Planificador de jugada: llena promo 0% primero, luego menor APR, ≤30% util
  const plan = () => {
    const sorted = [...cards].sort((a, b) => {
      const aPromo = a.promoApr === 0 ? 0 : 1
      const bPromo = b.promoApr === 0 ? 0 : 1
      if (aPromo !== bPromo) return aPromo - bPromo
      return (a.promoApr ?? a.apr) - (b.promoApr ?? b.apr)
    })
    const alloc: Record<string, number> = {}
    let remaining = target
    for (const c of sorted) {
      const room = Math.max(0, (MAX_UTIL / 100) * c.creditLimit - c.currentBalance - c.allocated)
      const take = Math.min(room, remaining)
      if (take > 0) alloc[c.id] = Math.round(take)
      remaining -= take
      if (remaining <= 0) break
    }
    setPlanned(alloc)
    if (remaining > 0) {
      toast.error(
        `Te faltan ${formatCurrency(remaining)} de capacidad al ${MAX_UTIL}% de utilización. Considera pedir aumentos de línea.`
      )
    }
  }

  const plannedApr = React.useMemo(() => {
    if (!planned) return null
    let total = 0
    let weighted = 0
    for (const [id, amt] of Object.entries(planned)) {
      const c = cards.find((x) => x.id === id)
      if (!c) continue
      total += amt
      weighted += amt * (c.promoApr ?? c.apr)
    }
    return total > 0 ? weighted / total : 0
  }, [planned, cards])

  const plannedTotal = planned
    ? Object.values(planned).reduce((a, b) => a + b, 0)
    : 0

  const editCard = cards.find((c) => c.id === editId)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Crédito total" value={formatCurrency(totals.limit)} sub={`${cards.length} líneas`} />
        <SummaryCard
          label="Utilización global"
          value={`${totals.util}%`}
          sub={totals.util <= MAX_UTIL ? "saludable" : "por encima del ideal"}
          tone={totals.util <= MAX_UTIL ? "good" : "warn"}
        />
        <SummaryCard label="En jugadas activas" value={formatCurrency(totals.allocated)} sub="asignado a deals" />
        <SummaryCard label="Disponible" value={formatCurrency(totals.available)} sub="sin comprometer" tone="good" />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* ------------------------------ Tarjetas ------------------------------ */}
        <div className="space-y-3 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold">Tus líneas</h3>
            <p className="text-[11px] text-muted-foreground">
              Balance + asignado vs. límite
            </p>
          </div>
          {cards.map((c) => {
            const util = utilOf(c)
            const balancePct = (c.currentBalance / c.creditLimit) * 100
            return (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                        <CardIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {c.issuer} · vence día {c.dueDay} · {c.rewards}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.promoApr === 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <BadgePercent className="size-3" />
                          0% hasta {new Date(`${c.promoEnds}T12:00:00`).toLocaleDateString("es-PR", { month: "short", year: "numeric" })}
                        </span>
                      )}
                      <button
                        onClick={() => setEditId(c.id)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Editar"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/45"
                        style={{ width: `${balancePct}%` }}
                      />
                      <div
                        className="absolute inset-y-0 rounded-r-full bg-primary"
                        style={{ left: `${balancePct}%`, width: `${(c.allocated / c.creditLimit) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">
                        Balance {formatCurrency(c.currentBalance)}
                        {c.allocated > 0 && (
                          <span className="text-primary">
                            {" "}+ {formatCurrency(c.allocated)} en jugada
                          </span>
                        )}
                      </span>
                      <span className={cn("font-semibold", utilColor(util))}>
                        {util}% de {formatCurrency(c.creditLimit)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ------------------------------ Plan de jugada ------------------------------ */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-primary/25 bg-gradient-to-br from-primary/6 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-primary" />
                Plan de jugada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                ¿Cuánto necesitas para tu próximo deal? El planificador distribuye
                el monto entre tus líneas — priorizando las del 0% APR y sin pasar
                del {MAX_UTIL}% de utilización por tarjeta.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value) || 0)}
                    step={5000}
                    className="h-11 rounded-full pl-7"
                  />
                </div>
                <Button size="lg" onClick={plan}>
                  <Play className="size-4" />
                  Planificar
                </Button>
              </div>

              {planned && (
                <div className="space-y-2.5 animate-fade-in">
                  <Separator />
                  {Object.entries(planned).map(([id, amt]) => {
                    const c = cards.find((x) => x.id === id)
                    if (!c) return null
                    const newUtil = Math.round(
                      ((c.currentBalance + c.allocated + amt) / c.creditLimit) * 100
                    )
                    return (
                      <div key={id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-[13px] font-medium">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {(c.promoApr ?? c.apr)}% APR → {newUtil}% util
                          </p>
                        </div>
                        <span className="font-heading font-bold">{formatCurrency(amt)}</span>
                      </div>
                    )
                  })}
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-xl bg-muted p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase">Costo promedio</p>
                      <p className="font-heading text-lg font-bold">
                        {plannedApr?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase">Pago mín. est.</p>
                      <p className="font-heading text-lg font-bold">
                        {formatCurrency(Math.round(plannedTotal * 0.02))}
                        <span className="text-[10px] font-normal text-muted-foreground">/mes</span>
                      </p>
                    </div>
                  </div>
                  {plannedTotal < target && (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                      Solo alcanzas {formatCurrency(plannedTotal)} de{" "}
                      {formatCurrency(target)} manteniendo utilización saludable.
                      Opciones: pedir aumento de línea, abrir otra tarjeta al 0%, o
                      ajustar el deal.
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => {
                      applyPlan(
                        Object.fromEntries(
                          cards.map((c) => [
                            c.id,
                            (c.allocated ?? 0) + (planned[c.id] ?? 0),
                          ])
                        )
                      )
                      toast.success("Plan aplicado a tus líneas")
                      setPlanned(null)
                    }}
                  >
                    <Landmark className="size-4" />
                    Aplicar plan a mis líneas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-[11px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Regla de la comunidad:</strong>{" "}
              nunca pases del {MAX_UTIL}% por tarjeta después del mes 3 de la
              jugada. Usa el cash flow de la propiedad para bajar los balances y
              liberar las líneas para el próximo deal.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog editar */}
      <Dialog open={!!editCard} onOpenChange={(v) => !v && setEditId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar {editCard?.name}</DialogTitle>
          </DialogHeader>
          {editCard && (
            <EditCardForm
              card={editCard}
              onSave={(patch) => {
                updateCard(editCard.id, patch)
                setEditId(null)
                toast.success("Tarjeta actualizada")
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub: string
  tone?: "good" | "warn"
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-1 font-heading text-xl font-bold tracking-tight sm:text-2xl",
            tone === "good" && "text-primary",
            tone === "warn" && "text-amber-500"
          )}
        >
          {value}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  )
}

function EditCardForm({
  card,
  onSave,
}: {
  card: CreditCard
  onSave: (patch: Partial<CreditCard>) => void
}) {
  const [limit, setLimit] = React.useState(card.creditLimit)
  const [balance, setBalance] = React.useState(card.currentBalance)
  const [apr, setApr] = React.useState(card.apr)

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Límite de crédito</Label>
        <Input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value) || 0)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Balance actual</Label>
        <Input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value) || 0)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">APR %</Label>
        <Input type="number" value={apr} onChange={(e) => setApr(Number(e.target.value) || 0)} step={0.5} />
      </div>
      <Button className="w-full" onClick={() => onSave({ creditLimit: limit, currentBalance: balance, apr })}>
        <Plus className="size-4" />
        Guardar cambios
      </Button>
    </div>
  )
}
