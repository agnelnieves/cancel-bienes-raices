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

import { usePipelineStore } from "@/lib/stores/pipeline"

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

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Valor del pipeline" value={formatCompact(pipelineValue)} sub={`${activeDeals.length} deals activos`} />
        <StatCard
          label="ROI promedio"
          value={`${avgRoi.toFixed(1)}%`}
          sub={avgRoi >= 8 ? "vs. 8% típico en PR — vas bien" : "el típico en PR es ~8%"}
          tone={avgRoi >= 8 ? "good" : "neutral"}
        />
        <StatCard
          label="Cash flow potencial"
          value={`${formatCurrency(Math.round(deals.reduce((a, d) => a + d.cashFlow, 0)))}`}
          sub="mensual combinado"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Tu próximo paso: arrastra cada tarjeta a la etapa donde va el deal
        </p>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-3.5" />
          Nuevo deal
        </Button>
      </div>

      {/* Kanban */}
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
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
        "flex w-64 shrink-0 flex-col rounded-2xl border p-2 transition-colors",
        isOver ? "border-primary/50 bg-primary/5" : "border-border bg-muted/40"
      )}
    >
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold">{stageLabel(stage)}</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
            {deals.length}
          </span>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">
          {formatCompact(total)}
        </span>
      </div>
      <div className="flex min-h-24 flex-1 flex-col gap-2">
        {deals.map((deal) => (
          <DraggableDealCard key={deal.id} deal={deal} onOpen={onOpen} />
        ))}
        {deals.length === 0 && <EmptyColumnHint stage={stage} />}
      </div>

      {/* Footer agregado — valor de la etapa de un vistazo (HubSpot) */}
      {deals.length > 0 && (
        <div className="mt-2 flex items-center justify-between border-t border-border/70 px-2 pt-2 pb-0.5">
          <span className="text-[10px] font-semibold text-foreground/80">
            Total {formatCompact(total)}
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
    <div className="flex flex-1 flex-col gap-2">
      {stage === "prospecto" && (
        <div
          aria-hidden="true"
          className="rounded-xl border border-dashed border-border bg-card/60 p-3 opacity-75"
        >
          <p className="truncate text-[13px] font-medium text-muted-foreground">
            Ej.: Casa 3h/2b, Bayamón
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-heading text-sm font-bold text-muted-foreground">
              $165K
            </span>
            <Badge variant="success">12% ROI</Badge>
          </div>
        </div>
      )}
      <p className="px-2 py-3 text-center text-[11px] leading-relaxed text-muted-foreground/80">
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
    <Card
      className={cn(
        "shadow-card transition-all",
        overlay ? "rotate-2 shadow-lift" : "hover:shadow-soft"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-1.5">
          <div className="min-w-0 flex-1" onClick={onOpen} role={onOpen ? "button" : undefined}>
            <p className="cursor-pointer truncate text-[13px] leading-snug font-medium">
              {deal.address}
            </p>
            <p className="text-[11px] text-muted-foreground">{deal.city}</p>
          </div>
          {dragHandle}
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="font-heading text-sm font-bold">
            {formatCompact(deal.askingPrice)}
          </span>
          <Badge variant={tier.variant}>
            {deal.roi > 0 ? `${deal.roi}% ROI · ${tier.verdict}` : "ROI sin estimar"}
          </Badge>
        </div>

        {/* Próximo paso — convierte el tablero en guía */}
        {deal.nextStep && (
          <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-foreground/75">
            <ArrowRight className="mt-0.5 size-3 shrink-0 text-primary" aria-hidden />
            <span className="min-w-0">{deal.nextStep}</span>
          </p>
        )}

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2.5 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CircleDollarSign className="size-3" />
              {formatCurrency(deal.cashFlow)}/mes
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3" />
              {deal.updatedAt.slice(5)}
            </span>
          </span>
          {isStale && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-1.5 py-0.5 text-[9px] font-semibold text-warning"
              title={`Sin actividad hace ${staleDays} días`}
            >
              <AlertTriangle className="size-2.5" aria-hidden />
              {staleDays}d sin tocar
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub: string
  tone?: "good" | "neutral"
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-1 font-heading text-xl font-bold tracking-tight sm:text-2xl",
            tone === "good" && "text-success"
          )}
        >
          {value}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>
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
