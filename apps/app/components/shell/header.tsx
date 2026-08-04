"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { CircleUser, LogOut, Moon, RotateCcw, Settings, Sun } from "lucide-react"
import { toast } from "sonner"

import { recentActivity } from "@cancel/data"
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  cn,
} from "@cancel/ui"

import { BellIcon, PanelLeftOpenIcon, SparklesIcon } from "@/components/icons"
import { useAssistantStore } from "@/lib/stores/assistant"
import { useShellStore } from "@/lib/stores/shell"
import { useUserStore } from "@/lib/stores/user"
import { Logo } from "./logo"

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Inicio", subtitle: "Tu centro de inversión" },
  "/comparables": {
    title: "Comparables",
    subtitle: "Ventas reales — incluyendo cash deals exclusivos",
  },
  "/calculadora": {
    title: "Calculadora ROI",
    subtitle: "Cap rate, cash flow y break-even al instante",
  },
  "/estimador": {
    title: "Estimador de remodelación",
    subtitle: "Presupuesto por partida con precios de PR",
  },
  "/comparador": {
    title: "Comparador",
    subtitle: "Hasta 5 propiedades lado a lado con scoring",
  },
  "/deals": {
    title: "Deal Tracker",
    subtitle: "Tu pipeline de prospecto a cierre",
  },
  "/credito": {
    title: "Planificador de crédito",
    subtitle: "Utilización estratégica de tus líneas",
  },
  "/comunidad": {
    title: "Comunidad",
    subtitle: "Los inversionistas de la red",
  },
  "/contratistas": {
    title: "Red de contratistas",
    subtitle: "Profesionales vetados por la comunidad",
  },
  "/configuracion": {
    title: "Configuración",
    subtitle: "Tu cuenta y preferencias",
  },
}

const activityDot: Record<string, string> = {
  cash: "bg-cash",
  comparable: "bg-info",
  deal: "bg-primary",
  sistema: "bg-muted-foreground/40",
}

/** Sidebar trigger — matches shadcn sidebar-08 header control */
function SidebarTrigger({ className }: { className?: string }) {
  const collapsed = useShellStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useShellStore((s) => s.toggleSidebar)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("hidden lg:inline-flex", className)}
      onClick={toggleSidebar}
      aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      aria-pressed={collapsed}
    >
      <PanelLeftOpenIcon size={16} className="[&>svg]:block" />
    </Button>
  )
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const toggleAssistant = useAssistantStore((s) => s.toggle)
  const profile = useUserStore((s) => s.profile)
  const resetUser = useUserStore((s) => s.reset)
  const isHome = pathname === "/"
  const meta = TITLES[pathname] ?? { title: "Cancel", subtitle: "" }

  const initials =
    profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "TU"

  const resetDemo = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("cbr-"))
      .forEach((k) => localStorage.removeItem(k))
    toast.success("Demo restablecido")
    resetUser()
    setTimeout(() => window.location.reload(), 400)
  }

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-border/50 bg-background/90 backdrop-blur-xl lg:rounded-t-xl">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-5">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-1 hidden h-4 self-auto data-vertical:h-4 lg:block"
        />

        <span className="lg:hidden">
          <Logo markClassName="size-7 text-sm" />
        </span>

        {/* On home, page owns the greeting — header stays as a quiet toolbar */}
        {!isHome && (
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-[15px] font-semibold tracking-tight">
              {meta.title}
            </h1>
            <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
              {meta.subtitle}
            </p>
          </div>
        )}
        {isHome && <div className="min-w-0 flex-1" />}

        <button
          type="button"
          onClick={toggleAssistant}
          className="group/copilot hidden h-8 items-center gap-2 rounded-lg border border-border/80 bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground sm:flex"
        >
          <SparklesIcon size={14} className="text-primary [&>svg]:block" />
          <span className="text-[12.5px]">Pregúntale al copiloto…</span>
          <kbd className="rounded border border-border bg-muted/80 px-1.5 py-px text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              aria-label="Notificaciones"
            >
              <BellIcon size={16} className="[&>svg]:block" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Actividad reciente</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentActivity.slice(0, 5).map((a) => (
              <DropdownMenuItem
                key={a.id}
                className="flex items-start gap-2.5 py-2.5"
              >
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    activityDot[a.type] ?? "bg-muted-foreground/40"
                  )}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13px]">{a.message}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {a.time}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Cambiar tema"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="outline-none">
              <Avatar className="size-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <CircleUser className="size-4 text-muted-foreground" />
              <span className="truncate">{profile.name || "Tu cuenta"}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/configuracion")}>
              <Settings className="size-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem onClick={resetDemo}>
              <RotateCcw className="size-4" />
              Restablecer demo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetDemo}>
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
