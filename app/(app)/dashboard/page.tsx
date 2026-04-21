import {
  Search,
  TrendingUp,
  DollarSign,
  Kanban,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Activity,
} from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  dashboardStats,
  recentActivity,
  mockDeals,
  formatCurrency,
  formatNumber,
  getStageLabel,
  getStageColor,
} from "@/lib/mock-data"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard — Bienes Raíces CR",
}

const statCards = [
  {
    label: "Comparables Disponibles",
    value: formatNumber(dashboardStats.totalComparables),
    change: "+47 esta semana",
    icon: Search,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Deals Activos",
    value: dashboardStats.activeDeals.toString(),
    change: "2 en negociación",
    icon: Kanban,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Valor Promedio",
    value: formatCurrency(dashboardStats.avgPropertyValue),
    change: "+3.2% vs mes anterior",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "ROI Promedio",
    value: `${dashboardStats.avgRoi}%`,
    change: "Mercado zona metro",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
  },
]

const quickActions = [
  {
    label: "Buscar Comparables",
    href: "/comparables",
    icon: Search,
    description: "Encuentra propiedades similares",
  },
  {
    label: "Calcular ROI",
    href: "/calculadora",
    icon: TrendingUp,
    description: "Analiza una inversión",
  },
  {
    label: "Nuevo Deal",
    href: "/deals",
    icon: Kanban,
    description: "Añade a tu pipeline",
  },
]

function getActivityIcon(type: string) {
  switch (type) {
    case "comparable":
      return Search
    case "deal":
      return Kanban
    case "cash":
      return Banknote
    default:
      return Activity
  }
}

export default function DashboardPage() {
  const activeDeals = mockDeals.filter((d) => d.stage !== "cierre").slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div
                  className={`flex size-9 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <stat.icon className={`size-4 ${stat.color}`} />
                </div>
              </div>
              <p className="mt-2 font-heading text-2xl font-bold">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                  <action.icon className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-base">
                Actividad Reciente
              </CardTitle>
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                En vivo
              </Badge>
            </div>
            <CardDescription>
              Últimas actualizaciones del mercado y tu actividad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Icon className="size-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {activity.timestamp}
                        </p>
                      </div>
                      {activity.type === "cash" && (
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[10px]"
                        >
                          <BadgeCheck className="size-3 text-primary" />
                          Exclusivo
                        </Badge>
                      )}
                    </div>
                    {i < recentActivity.length - 1 && (
                      <Separator className="ml-10 mt-3" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Deals */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading text-base">
                Deals Activos
              </CardTitle>
              <CardDescription>
                Tu pipeline de inversiones actual
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/deals">
                Ver todos
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {activeDeals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-start gap-3 rounded-lg border border-border/40 p-3"
              >
                <div
                  className={`mt-1 size-2 shrink-0 rounded-full ${getStageColor(deal.stage)}`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    {deal.propertyAddress}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {deal.city}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {getStageLabel(deal.stage)}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {formatCurrency(deal.askingPrice)}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      {deal.estimatedRoi}% ROI
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
