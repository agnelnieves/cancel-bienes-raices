"use client"

import { useState } from "react"
import {
  Plus,
  MoreHorizontal,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  User,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  mockDeals,
  dealStages,
  formatCurrency,
  getStageLabel,
  getStageColor,
  type Deal,
  type DealStage,
} from "@/lib/mock-data"

export default function DealsPage() {
  const [deals] = useState<Deal[]>(mockDeals)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")

  const dealsByStage = dealStages.map((stage) => ({
    ...stage,
    deals: deals.filter((d) => d.stage === stage.id),
  }))

  const totalPipeline = deals.reduce(
    (sum, d) => sum + (d.offerPrice ?? d.askingPrice),
    0,
  )
  const avgRoi =
    deals.length > 0
      ? deals.reduce((sum, d) => sum + d.estimatedRoi, 0) / deals.length
      : 0

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Total Pipeline</p>
            <p className="font-heading text-xl font-bold">
              {formatCurrency(totalPipeline)}
            </p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div>
            <p className="text-xs text-muted-foreground">Deals activos</p>
            <p className="font-heading text-xl font-bold">{deals.length}</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div>
            <p className="text-xs text-muted-foreground">ROI promedio</p>
            <p className="font-heading text-xl font-bold">
              {avgRoi.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-lg border border-border">
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none border-0"
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none border-0"
              onClick={() => setViewMode("list")}
            >
              Lista
            </Button>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            Nuevo Deal
          </Button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        /* Kanban View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dealsByStage.map((stage) => (
            <div key={stage.id} className="w-72 shrink-0 space-y-3">
              {/* Column Header */}
              <div className="flex items-center gap-2 px-1">
                <div
                  className={`size-2.5 rounded-full ${stage.color}`}
                />
                <h3 className="text-sm font-medium">{stage.label}</h3>
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {stage.deals.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="space-y-2.5">
                {stage.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}

                {stage.deals.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
                    <p className="text-xs text-muted-foreground">
                      Sin deals
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-[11px] font-medium text-muted-foreground">
                <div className="col-span-4 flex items-center gap-1">
                  Propiedad
                  <ArrowUpDown className="size-3" />
                </div>
                <div className="col-span-2">Etapa</div>
                <div className="col-span-2 text-right">Precio</div>
                <div className="col-span-1 text-right">ROI</div>
                <div className="col-span-2 text-right">Cash Flow</div>
                <div className="col-span-1" />
              </div>

              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="grid grid-cols-12 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="col-span-4">
                    <p className="text-sm font-medium">
                      {deal.propertyAddress}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {deal.city} · {deal.contactName}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant="secondary"
                      className="gap-1.5 text-[10px]"
                    >
                      <span
                        className={`size-1.5 rounded-full ${getStageColor(deal.stage)}`}
                      />
                      {getStageLabel(deal.stage)}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(deal.offerPrice ?? deal.askingPrice)}
                    </p>
                    {deal.offerPrice && (
                      <p className="text-[10px] text-muted-foreground line-through">
                        {formatCurrency(deal.askingPrice)}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {deal.estimatedRoi}%
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-medium">
                      {formatCurrency(deal.estimatedCashFlow)}/mo
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="icon-xs">
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-tight">
              {deal.propertyAddress}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3" />
              {deal.city}
            </div>
          </div>
          <Button variant="ghost" size="icon-xs" className="shrink-0">
            <MoreHorizontal className="size-3.5" />
          </Button>
        </div>

        <Separator className="my-2.5" />

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-3 text-muted-foreground" />
            <span className="text-xs font-medium">
              {formatCurrency(deal.offerPrice ?? deal.askingPrice)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-3 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {deal.estimatedRoi}% ROI
            </span>
          </div>
        </div>

        {deal.notes && (
          <p className="mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {deal.notes}
          </p>
        )}

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <User className="size-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {deal.contactName}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="size-3" />
            {new Date(deal.updatedAt).toLocaleDateString("es-PR", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
