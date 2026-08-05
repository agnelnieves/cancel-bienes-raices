"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  GripVertical,
  KanbanSquare,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import {
  dealStages,
  formatCompact,
  formatCurrency,
  stageLabel,
  type Deal,
  type DealStage,
} from "@cancel/data"
import { PageHeader } from "@/components/page-header"
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Textarea,
  cn,
} from "@cancel/ui"

import { Sparkline } from "@/components/charts"
import { usePipelineStore } from "@/lib/stores/pipeline"

/** Tiny trend series for per-card sparklines — ends at `end` */
function sparkSeries(end: number, factors: number[]) {
  return factors.map((f) => Math.max(0, Math.round(end * f)))
}

/** Tier de ROI con variante de Badge + lectura en español llano */
function roiTier(roi: number): {
  variant: "success" | "warning" | "destructive" | "outline"
  verdict: string
} {
  if (roi <= 0) return { variant: "outline", verdict: "Sin estimar" }
  if (roi >= 14) return { variant: "success", verdict: "fuerte" }
  if (roi >= 8) return { variant: "warning", verdict: "moderado" }
  return { variant: "destructive", verdict: "bajo" }
}

/** Días desde el último toque al deal — para el indicador de salud */
function daysSince(isoDate: string): number {
  const then = new Date(isoDate + "T00:00:00").getTime()
  const now = new Date().setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((now - then) / 86400000))
}

const EMPTY_HINT: Record<DealStage, string> = {
  prospecto: "Esa propiedad con potencial que viste — añádela con “Nuevo deal”.",
  analisis: "Arrastra aquí la que ya estás corriendo en números.",
  oferta: "Cuando ofertes, muévela a esta etapa.",
  negociacion: "Aquí van los regateos y contraofertas.",
  "due-diligence": "Inspección, tasación y papeleo — la recta final.",
  cierre: "Aquí celebramos los cerrados. 🎉",
}

export default function DealsPage() {
  const { deals, moveDeal, updateDeal, removeDeal } = usePipelineStore()
  const [activeDrag, setActiveDrag] = React.useState<Deal | null>(null)
  const [detailId, setDetailId] = React.useState<string | null>(null)
  const [addOpen, setAddOpen] = React.useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const activeDeals = deals.filter((d) => d.stage !== "cierre")
  const pipelineValue = activeDeals.reduce((a, d) => a + d.askingPrice, 0)
  const avgRoi =
    deals.length > 0
      ? deals.reduce((a, d) => a + d.roi, 0) / deals.length
      : 0

  const onDragStart = (e: DragStartEvent) => {
    const deal = deals.find((d) => d.id === e.active.id)
    setActiveDrag(deal ?? null)
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null)
    const dealId = String(e.active.id)
    const stage = e.over?.id as DealStage | undefined
    if (!stage) return
    const deal = deals.find((d) => d.id === dealId)
    if (deal && deal.stage !== stage) {
      moveDeal(dealId, stage)
      toast.success(`Movido a ${stageLabel(stage)}`)
    }
  }

  const detail = deals.find((d) => d.id === detailId)
  const totalCashFlow = Math.round(
    deals.reduce((a, d) => a + d.cashFlow, 0)
  )

  const pipelineSpark = React.useMemo(
    () =>
      sparkSeries(pipelineValue || 1_200_000, [
        0.55, 0.58, 0.62, 0.68, 0.74, 0.81, 0.9, 0.95, 1,
      ]),
    [pipelineValue]
  )
  const roiSpark = React.useMemo(
    () =>
      sparkSeries(Math.max(avgRoi, 1), [
        0.72, 0.78, 0.75, 0.82, 0.88, 0.91, 0.94, 0.97, 1,
      ]),
    [avgRoi]
  )
  const cashSpark = React.useMemo(
    () =>
      sparkSeries(Math.max(totalCashFlow, 1000), [
        0.48, 0.55, 0.6, 0.66, 0.72, 0.8, 0.86, 0.93, 1,
      ]),
    [totalCashFlow]
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Deal Tracker"
        description="Tu pipeline de prospecto a cierre"
        actions={
          <Button size="sm" className="rounded-lg" onClick={() => setAddOpen(true)}>
            <Plus className="size-3.5" />
            Nuevo deal
          </Button>
        }
      />

      {/* Stats — separate cards with tiny per-card sparklines */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          id="pipeline"
          label="Valor del pipeline"
          value={formatCompact(pipelineValue)}
          sub={`${activeDeals.length} deals activos`}
          spark={pipelineSpark}
        />
        <StatCard
          id="roi"
          label="ROI promedio"
          value={`${avgRoi.toFixed(1)}%`}
          sub={
            avgRoi >= 8
              ? "vs. 8% típico en PR — vas bien"
              : "el típico en PR es ~8%"
          }
          tone={avgRoi >= 8 ? "good" : "neutral"}
          spark={roiSpark}
        />
        <StatCard
          id="cashflow"
          label="Cash flow potencial"
          value={formatCurrency(totalCashFlow)}
          sub="mensual combinado"
          spark={cashSpark}
        />
      </div>

      <p className="text-[13px] text-muted-foreground">
        Arrastra cada tarjeta a la etapa del deal
      </p>

      {/* Kanban */}
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex scroll-fade-x gap-2.5 overflow-x-auto pb-4">
          {dealStages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage.id}
              deals={deals.filter((d) => d.stage === stage.id)}
              onOpen={(id) => setDetailId(id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeDrag && <DealCard deal={activeDrag} overlay />}
        </DragOverlay>
      </DndContext>

      {/* Sheet de detalle */}
      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetailId(null)}>
        <SheetContent className="sm:max-w-md">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="leading-snug pr-2">
                  {detail.address}
                </SheetTitle>
                <p className="text-xs text-muted-foreground">{detail.city}</p>
              </SheetHeader>

              <SheetBody className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="Precio pedido" value={formatCurrency(detail.askingPrice)} />
                  <MiniStat
                    label="Tu oferta"
                    value={detail.offerPrice ? formatCurrency(detail.offerPrice) : "—"}
                  />
                  <MiniStat
                    label="ROI estimado"
                    value={`${detail.roi}%`}
                    verdict={roiTier(detail.roi).verdict}
                    highlight={detail.roi >= 14}
                  />
                  <MiniStat label="Cash flow est." value={`${formatCurrency(detail.cashFlow)}/mes`} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Etapa</Label>
                  <Select
                    value={detail.stage}
                    onValueChange={(v) => {
                      updateDeal(detail.id, { stage: v as DealStage })
                      toast.success(`Movido a ${stageLabel(v as DealStage)}`)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dealStages.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Contacto</Label>
                    <Input
                      value={detail.contactName}
                      onChange={(e) => updateDeal(detail.id, { contactName: e.target.value })}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Rol</Label>
                    <Input
                      value={detail.contactRole}
                      onChange={(e) => updateDeal(detail.id, { contactRole: e.target.value })}
                      placeholder="Realtor, dueño…"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Próximo paso</Label>
                  <Input
                    value={detail.nextStep ?? ""}
                    onChange={(e) => updateDeal(detail.id, { nextStep: e.target.value })}
                    placeholder="Ej.: llamar al realtor, correr calculadora…"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Aparece en la tarjeta del tablero — tu guía de qué hacer después.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Notas</Label>
                  <Textarea
                    value={detail.notes}
                    onChange={(e) => updateDeal(detail.id, { notes: e.target.value })}
                    rows={5}
                    placeholder="Notas del deal…"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <p className="text-[11px] text-muted-foreground">
                    Actualizado {detail.updatedAt}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      removeDeal(detail.id)
                      setDetailId(null)
                      toast.success("Deal eliminado")
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar
                  </Button>
                </div>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AddDealDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}

// ---------------------------------------------------------------------------

function StageColumn({
  stage,
  deals,
  onOpen,
}: {
  stage: DealStage
  deals: Deal[]
  onOpen: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const total = deals.reduce((a, d) => a + d.askingPrice, 0)
  const staleCount = deals.filter(
    (d) => daysSince(d.updatedAt) >= 7 && d.stage !== "cierre"
  ).length

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-[248px] shrink-0 flex-col rounded-xl bg-muted/35 p-1.5 transition-colors",
        isOver && "bg-muted/70 ring-1 ring-foreground/10"
      )}
    >
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-semibold tracking-tight">
            {stageLabel(stage)}
          </span>
          <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-background px-1 text-[10px] font-medium text-muted-foreground tabular-nums">
            {deals.length}
          </span>
        </div>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {formatCompact(total)}
        </span>
      </div>
      <div className="flex min-h-20 flex-1 flex-col gap-1.5">
        {deals.map((deal) => (
          <DraggableDealCard key={deal.id} deal={deal} onOpen={onOpen} />
        ))}
        {deals.length === 0 && <EmptyColumnHint stage={stage} />}
      </div>

      {deals.length > 0 && (
        <div className="mt-1.5 flex items-center justify-between px-2 pt-1.5 pb-0.5">
          <span className="text-[10px] font-medium text-muted-foreground">
            {formatCompact(total)}
          </span>
          {staleCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-warning">
              <AlertTriangle className="size-2.5" aria-hidden />
              {staleCount} estancado{staleCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/** Estado vacío que enseña: tarjeta de muestra + pista de qué va aquí */
function EmptyColumnHint({ stage }: { stage: DealStage }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      {stage === "prospecto" && (
        <div
          aria-hidden="true"
          className="rounded-lg border border-dashed border-border bg-background/50 p-2.5 opacity-70"
        >
          <p className="truncate text-[12px] font-medium text-muted-foreground">
            Ej.: Casa 3h/2b, Bayamón
          </p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="font-heading text-[12px] font-semibold text-muted-foreground">
              $165K
            </span>
            <span className="text-[10px] text-muted-foreground">12% ROI</span>
          </div>
        </div>
      )}
      <p className="px-1.5 py-2 text-center text-[10.5px] leading-relaxed text-muted-foreground/80">
        {EMPTY_HINT[stage] ?? "Arrastra una tarjeta aquí."}
      </p>
    </div>
  )
}

function DraggableDealCard({
  deal,
  onOpen,
}: {
  deal: Deal
  onOpen: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: deal.id })

  return (
    <div
      ref={setNodeRef}
      style={
        transform
          ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
          : undefined
      }
      className={cn(isDragging && "opacity-40")}
    >
      <DealCard
        deal={deal}
        onOpen={() => onOpen(deal.id)}
        dragHandle={
          <button
            {...listeners}
            {...attributes}
            className="cursor-grab touch-none text-muted-foreground/50 transition-colors hover:text-muted-foreground active:cursor-grabbing"
            aria-label={`Arrastrar ${deal.address}`}
          >
            <GripVertical className="size-4" />
          </button>
        }
      />
    </div>
  )
}

function DealCard({
  deal,
  onOpen,
  dragHandle,
  overlay,
}: {
  deal: Deal
  onOpen?: () => void
  dragHandle?: React.ReactNode
  overlay?: boolean
}) {
  const tier = roiTier(deal.roi)
  const staleDays = daysSince(deal.updatedAt)
  // Estancado: sin tocar 7+ días y aún no cierra (HubSpot "no activity")
  const isStale = staleDays >= 7 && deal.stage !== "cierre"

  return (
    <div
      className={cn(
        "rounded-lg bg-background p-2.5 shadow-card transition-shadow",
        overlay ? "rotate-1 shadow-lift" : "hover:shadow-soft",
        onOpen && "cursor-pointer"
      )}
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
    >
      <div className="flex items-start gap-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] leading-snug font-medium">
            {deal.address}
          </p>
          <p className="text-[10.5px] text-muted-foreground">{deal.city}</p>
        </div>
        {dragHandle && (
          <span
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {dragHandle}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="font-heading text-[13px] font-semibold tabular-nums tracking-tight">
          {formatCompact(deal.askingPrice)}
        </span>
        <Badge
          variant={tier.variant}
          className="h-5 px-1.5 text-[10px] font-medium"
        >
          {deal.roi > 0 ? `${deal.roi}% · ${tier.verdict}` : "Sin ROI"}
        </Badge>
      </div>

      {deal.nextStep && (
        <p className="mt-1.5 flex items-start gap-1 text-[10.5px] leading-snug text-muted-foreground">
          <ArrowRight
            className="mt-0.5 size-2.5 shrink-0 text-primary"
            aria-hidden
          />
          <span className="min-w-0 line-clamp-2">{deal.nextStep}</span>
        </p>
      )}

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5 tabular-nums">
            <CircleDollarSign className="size-2.5" />
            {formatCurrency(deal.cashFlow)}/mes
          </span>
          <span className="inline-flex items-center gap-0.5">
            <CalendarDays className="size-2.5" />
            {deal.updatedAt.slice(5)}
          </span>
        </span>
        {isStale && (
          <span
            className="inline-flex items-center gap-0.5 rounded-full bg-warning-soft px-1.5 py-px text-[9px] font-medium text-warning"
            title={`Sin actividad hace ${staleDays} días`}
          >
            <AlertTriangle className="size-2.5" aria-hidden />
            {staleDays}d
          </span>
        )}
      </div>
    </div>
  )
}

/** Compact KPI card with a tiny trend sparkline (like cash % / trend columns) */
function StatCard({
  id,
  label,
  value,
  sub,
  tone,
  spark,
}: {
  id: string
  label: string
  value: string
  sub: string
  tone?: "good" | "neutral"
  spark: number[]
}) {
  return (
    <Card>
      <CardContent className="p-3.5 sm:p-4">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "font-heading text-xl font-semibold tracking-tight tabular-nums sm:text-[22px]",
                tone === "good" && "text-primary"
              )}
            >
              {value}
            </p>
            <p className="mt-0.5 text-[10.5px] text-muted-foreground">{sub}</p>
          </div>
          <Sparkline
            id={id}
            data={spark}
            className="mb-0.5 h-9 w-[72px] shrink-0 sm:h-10 sm:w-20"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function MiniStat({
  label,
  value,
  verdict,
  highlight,
}: {
  label: string
  value: string
  verdict?: string
  highlight?: boolean
}) {
  return (
    <div className={cn("rounded-xl border border-border p-3", highlight && "border-success/30 bg-success-soft/50")}>
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className={cn("mt-0.5 font-heading text-base font-bold", highlight && "text-success")}>
        {value}
        {verdict && (
          <span className="ml-1.5 text-[10px] font-medium text-muted-foreground">
            {verdict}
          </span>
        )}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------

function AddDealDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const addDeal = usePipelineStore((s) => s.addDeal)
  const [address, setAddress] = React.useState("")
  const [city, setCity] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [roi, setRoi] = React.useState("")
  const [notes, setNotes] = React.useState("")

  const canSave = address.trim().length > 3 && Number(price) > 0

  const save = () => {
    addDeal({
      address: address.trim(),
      city: city.trim() || "Puerto Rico",
      stage: "prospecto",
      askingPrice: Number(price),
      offerPrice: null,
      roi: Number(roi) || 0,
      cashFlow: 0,
      notes: notes.trim(),
      contactName: "",
      contactRole: "",
    })
    toast.success("Deal añadido como prospecto")
    onOpenChange(false)
    setAddress("")
    setCity("")
    setPrice("")
    setRoi("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KanbanSquare className="size-4 text-primary" />
            Nuevo deal
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Dirección</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Urb. Ejemplo, Calle 1 #23"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Pueblo / zona</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bayamón" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Precio pedido</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="150000" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">ROI estimado (opcional)</Label>
            <Input type="number" value={roi} onChange={(e) => setRoi(e.target.value)} placeholder="12" />
            <p className="text-[10px] text-muted-foreground">
              Si no lo tienes, déjalo vacío — lo calculas después en la calculadora.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notas</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Contexto del deal…" />
          </div>
          <Button className="w-full" disabled={!canSave} onClick={save}>
            <Sparkles className="size-4" />
            Añadir como prospecto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
