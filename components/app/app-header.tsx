"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Vista general de tu actividad",
  },
  "/comparables": {
    title: "Comparables",
    description: "Busca propiedades similares vendidas recientemente",
  },
  "/calculadora": {
    title: "Calculadora ROI",
    description: "Analiza el retorno de inversión de una propiedad",
  },
  "/comparador": {
    title: "Comparador",
    description: "Compara propiedades lado a lado",
  },
  "/deals": {
    title: "Deal Flow",
    description: "Tu pipeline de inversiones",
  },
  "/credito": {
    title: "Crédito",
    description: "Planifica tu utilización de crédito",
  },
  "/configuracion": {
    title: "Configuración",
    description: "Ajustes de tu cuenta y preferencias",
  },
}

export function AppHeader() {
  const pathname = usePathname()
  const page = pageTitles[pathname] ?? {
    title: "Bienes Raíces CR",
    description: "",
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/40 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-heading text-sm font-semibold leading-tight">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-[11px] leading-tight text-muted-foreground">
              {page.description}
            </p>
          )}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Badge
          variant="secondary"
          className="hidden gap-1.5 text-[10px] sm:flex"
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Data actualizada hoy
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  )
}
